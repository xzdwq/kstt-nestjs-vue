<template lang="pug">
div(class="relative bg-background-secondary h-full p-2 rounded-md overflow-y-scroll")
  //- Наименование RU
  div(class="md:flex md:items-center mb-6")
    label(for="name_ru" class="w-[260px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('label-name', {locale: '(RU)'}) }}:
    input(
      v-model="v$.form.name_ru.$model"
      @input="inputNameRu"
      type="text"
      :placeholder="$t('label-name', {locale: '(RU)'})"
      name="name_ru"
      class="bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-copy-secondary"
      :class="v$.form.name_ru.$errors.length === 0 ? 'border-gray-200' : 'border-red-500'"
    )
  div.relative
    div(
      class="absolute mt-[-28px] md:right-0 text-red-600"
      v-for="(error, index) of v$.form.name_ru.$errors"
      :key="index"
    )
      div {{ error.$message }}
  //- Наименование EN
  div(class="md:flex md:items-center mb-6")
    label(for="name_en" class="w-[260px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('label-name', {locale: '(EN)'}) }}:
    input(
      v-model="v$.form.name_en.$model"
      @input="inputNameEn"
      type="text"
      :placeholder="$t('label-name', {locale: '(EN)'})"
      name="name_en"
      class="bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-copy-secondary"
      :class="v$.form.name_en.$errors.length === 0 ? 'border-gray-200' : 'border-red-500'"
    )
  div.relative
    div(
      class="absolute mt-[-28px] md:right-0 text-red-600"
      v-for="(error, index) of v$.form.name_en.$errors"
      :key="index"
    )
      div {{ error.$message }}
  //- Тип группы
  div(v-if="false" class="md:flex md:items-center mb-6")
    label(for="type" class="w-[260px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('type-signing') }}:
    select(
      v-model="form.type"
      @change="onSelected($event)"
      name="type"
      autocomplete="type"
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-copy-secondary cursor-pointer"
    )
      option(
        v-for="item in getGroupType"
        :value="item.id"
        :key="item.id"
      ) {{ this.$i18n.locale == 'ru' ? item.name_ru : item.name_en }}
  //- Сторона
  div(class="md:flex md:items-center mb-6")
    label(for="type" class="w-[260px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('side') }}:
    select(
      @change="onSelectedSide($event)"
      name="side"
      autocomplete="side"
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-copy-secondary cursor-pointer"
    )
      option(
        v-for="item in side"
        :value="item.id"
        :key="item.id"
      ) {{ this.$i18n.locale == 'ru' ? item.name_ru : item.name_en }}
  //- Участники
  div(class="md:flex md:items-center mb-6")
    label(for="type" class="w-[260px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('user-in-group') }}:
    multiselect(
      v-model="form.users"
      mode="tags"
      :multiple="true"
      :placeholder="$t('search-user')"
      :noOptionsText="$t('no-list-data')"
      :object="true"
      :filterResults="false"
      :resolveOnLoad="false"
      :delay="400"
      :searchable="true"
      :options="onSearch"
      :clearOnSearch="true"
      @select="onSelectUser"
      @deselect="onDeSelectUser"
      valueProp="Email"
      label="DisplayName"
      trackBy="UserName"
    )
      template(v-slot:option="{ option }")
        div
          div {{ option.DisplayName }}
          div(class="tetx-sm italic") {{ option.Position }}
</template>
<script>
import { getCurrentInstance } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'
import axios from "axios"
import {
  mapGetters,
  mapActions
} from 'vuex'

import toast from '@/mixins/toast'
export default {
  name: 'def-create-group',
  props: ['modalCfg'],
  mixins: [toast],
  setup () {
    const instance = getCurrentInstance();
    return {
      v$: useVuelidate(),
      instance: instance
    }
  },
  data() {
    return {
      side: [],
      form: {
        name_ru: null,
        name_en: null,
        type: null,
        users: []
      }
    }
  },
  validations() {
    return {
      form: {
        name_ru: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        },
        name_en: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getIsGroupTypeLoading: 'groupModule/getIsGroupTypeLoading',
      getGroupType: 'groupModule/getGroupType'
    })
  },
  methods: {
    ...mapActions({
      fetchGroup: 'groupModule/fetchGroup',
      fetchGroupType: 'groupModule/fetchGroupType',
      createNewGroup: 'groupModule/createNewGroup'
    }),
    inputNameRu(e) {
      if(this.v$.form.name_ru.$errors.length === 0) {
        this.modalCfg.form.name_ru = e.target.value
      } else {
        this.modalCfg.form.name_ru = null
      }
    },
    inputNameEn(e) {
      if(this.v$.form.name_en.$errors.length === 0) {
        this.modalCfg.form.name_en = e.target.value
      } else {
        this.modalCfg.form.name_en = null
      }
    },
    inputCode(e) {
      if(this.v$.form.code.$errors.length === 0) {
        String.prototype.translit = String.prototype.translit || function () {
          var Chars = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'YO', 'Ж': 'ZH', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHCH', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'YU', 'Я': 'YA'
          },
            t = this;
          for (var i in Chars) { t = t.replace(new RegExp(i, 'g'), Chars[i]); }
          return t;
        };
        this.modalCfg.form.code = e.target.value.replace(/ /g,"_").trim().toUpperCase().translit()
      } else {
        this.modalCfg.form.code = null
      }
    },
    onSelected(e) {
      this.modalCfg.form.type = +e.target.value
    },
    onSelectedSide(e) {
      this.modalCfg.form.side = +e.target.value
    },
    onSelectUser(val) {
      this.modalCfg.form.users.push(val)
    },
    onDeSelectUser(val) {
      const match = this.modalCfg.form.users.findIndex(i => i.Email === val.Email)
      this.modalCfg.form.users.splice(match, 1);
    },
    async onSearch(val) {
      if(val) {
        const data = await axios.get('api/defaultworkflow/userfound', {
          params: {
            _query: val
          }
        })
        if(data.data.isFound) {
          return data.data.data
        }
      }
    }
  },
  async mounted() {
    this.modalCfg.form = {
      name_ru: null,
      name_en: null,
      type: null,
      code: null,
      users: []
    }
    await this.fetchGroupType()
    .then((data) => {
      this.modalCfg.form.type = this.form.type = data.data[0].id 
    })
    await axios.get('api/side')
      .then(data => {
        if(data.data.success) {
          this.side = data.data.data
        }
      })
    /**
     * Принимаем событие из эвентбуса на создание новой группы
     */
    await this.emitter.all.clear()
    await this.emitter.on('onCreateNewGroup', () => {
      this.v$.$touch()
      if(
        this.v$.form.name_ru.$errors.length === 0
        && this.v$.form.name_en.$errors.length === 0
      ) {
        // Создаем код группы
        this.modalCfg.form.code = this.modalCfg.form.name_en.replace(/ /g,"_").trim().toUpperCase()
        this.modalCfg.form.code = 'AKKU_'+this.modalCfg.form.code
        // Отправляем данные
        this.createNewGroup(this.modalCfg.form)
        this.modalCfg.modalShow = false
        setTimeout(() => { this.fetchGroup() }, 400)
      }
    })
  }
}
</script>