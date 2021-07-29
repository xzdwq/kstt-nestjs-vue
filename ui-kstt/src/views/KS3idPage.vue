<template lang="pug">
div
  div(class="flex")
    def-button(
      class="text-white bg-[#579bae] flex justify-between"
      @click="$router.go(-1)"
    )
      svg-left
      span(class="pr-2") {{ $t('back') }}
  //- form
  div(v-if="getKS3id.length > 0 && !getIsLoading" class="pt-2")
    div(class="md:flex md:items-center mb-6")
      //- Ноиер справки КС-3
      label(for="certificate-number" class="w-[170px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('ks3.certificate-number') }}:
      div.relative
        input(
          v-model="v$.form.certificate_number.$model"
          type="text"
          name="certificate-number"
          class="bg-gray-200 appearance-none border-2 rounded w-32 py-2 pl-10 text-copy-secondary"
          :class="v$.form.certificate_number.$errors.length === 0 ? 'border-gray-200' : 'border-red-500'"
        )
        svg-refresh(
          class="cursor-pointer absolute left-0 top-0 mt-[10px] ml-2",
          @click="resetDefaultValue('certificate_number', $event)"
        )
      div(
        class="w-8 text-red-500"
      )
        Popper(
          arrow
          :hover="true"
          closeDelay="100"
          class="pl-1 popper-cust"
        )
          svg-exclamation(
            class="cursor-pointer"
            v-show="v$.form.certificate_number.$errors.length > 0"
          )
          template(#content)
            div(
              class="text-red-600 text-center"
              v-for="(error, index) of v$.form.certificate_number.$errors"
              :key="index"
            )
              div {{ error.$message }}
      //- Ноиер документа
      label(for="certificate-number" class="w-[170px] block font-bold mb-1 md:mb-0 pr-4 text-copy-primary") {{ $t('ks3.document-number') }}:
  //- load
  div(
    v-if="getKS3id.length === 0 && !getIsLoading"
    class="absolute w-[calc(100%-55px)] flex justify-center"
  )
    p {{ $t('oops-data', {id: id}) }}
  div(v-if="getKS3id.length === 0 && getIsLoading" class="absolute w-[calc(100%-55px)] flex items-center justify-center")
      svg-loading
      p {{ $t('loading') }}
</template>
<script>
import { getCurrentInstance } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'

import Popper from "vue3-popper";

import {
  mapGetters,
  mapActions
} from 'vuex'

import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css'
export default {
  name: 'ks3id-page',
  components: {
    Popper
  },
  setup () {
    const instance = getCurrentInstance();
    return {
      v$: useVuelidate(),
      instance: instance
    }
  },
  data() {
    return {
      id: this.$route.params.id,
      form: {
        certificate_number: null,
        document_number: null
      }
    }
  },
  validations() {
    return {
      form: {
        certificate_number: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        },
        document_number: {
          required: helpers.withMessage(this.$t('validator.required'), required),
          minLength: helpers.withMessage(({$params}) => this.$t('validator.minLenght', {count: $params.min}), minLength(2))
        }
      }
    }
  },
  methods: {
    ...mapActions({
      fetchKS3id: 'ks3idModule/fetchKS3id'
    }),
    resetDefaultValue(prop, event) {
      let el;
      event.target.localName === 'path' ? el = event.target.parentElement : el = event.target
      el.classList.add('animate-spin')
      setTimeout(() => { el.classList.remove('animate-spin') }, 500)
      this.form[prop] = this.getKS3id[0][prop]
    }
  },
  computed: {
    ...mapGetters({
      getIsLoading: 'ks3idModule/getIsLoading',
      getKS3id: 'ks3idModule/getKS3id'
    })
  },
  async mounted() {
    const data = await this.fetchKS3id(this.id);
    if(data.success) {
      this.form.certificate_number = data.data[0].certificate_number
    } else {
      createToast({
          title: data.message,
          description: this.$t('ks3.error-load-ks3id')
        },
        {
          showCloseButton: false,
          swipeClose: true,
          hideProgressBar: true,
          position: 'bottom-left',
          type: 'danger',
          showIcon: true,
          transition: 'bounce',
          timeout: 3500
      })
    }
  }
}
</script>