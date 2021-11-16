<template lang="pug">
div(class="mt-2")
  //- div(class="w-full flex justify-start font-bold") {{ $t('total-sum') }}:
  //- body
  //- Итого прямые затраты (ПЗ) по акту в текущих ценах, в т.ч./Total direct costs (DC) on Certificate in current prices, incl.:
  fieldset(class="p-2 border rounded-sm border-border-color-primary")
    legend(class="flex items-center ml-2 px-2 text-sm font-bold") {{ $t('total-direct-dc') }}
      div(class="w-5 h-5 ml-2 flex items-center justify-center border border-border-color-primary rounded-md ")
        svg-down(
          class="duration-300 cursor-pointer w-[17px]"
          :class="{'rotate-180': isOpenTotal}"
          @click="isOpenTotal = !isOpenTotal"
        )
    div(
      v-if="getKs2TotalSum.length > 0"
      class="grid gap-2 text-[14px] transition-all duration-700 overflow-hidden"
      :class="isOpenTotal ? 'max-h-[300px]' : 'max-h-0'"
      :style="gridStyle"
    )
      //- Общая/ Total
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('total') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum.total"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum.total != getKs2TotalSum[0].total ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum', getKs2TotalSum, 'total', 'number', $event)"
            )
      //- Основная зарплата/ Basic salary
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('basic_salary') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum.basic_salary"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum.basic_salary != getKs2TotalSum[0].basic_salary ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum', getKs2TotalSum, 'basic_salary', 'number', $event)"
            )
      //- Эксплуатация машин/ Operation of mechanisms
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('operation_mechanisms') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum.operation_mechanisms"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum.operation_mechanisms != getKs2TotalSum[0].operation_mechanisms ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum', getKs2TotalSum, 'operation_mechanisms', 'number', $event)"
            )
      //- Зарплата машинистов/Salary of mechanics
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('salary_mechanics') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum.salary_mechanics"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum.salary_mechanics != getKs2TotalSum[0].salary_mechanics ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum', getKs2TotalSum, 'salary_mechanics', 'number', $event)"
            )
      //- Материалы/ Materials
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('materials') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum.materials"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum.materials != getKs2TotalSum[0].materials ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum', getKs2TotalSum, 'materials', 'number', $event)"
            )
      //- Трудозатраты рабочих, чел.-ч/ Workers labour effort, manhour
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('labor_workers') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum.labor_workers"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum.labor_workers != getKs2TotalSum[0].labor_workers ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum', getKs2TotalSum, 'labor_workers', 'number', $event)"
            )
      //- Трудозатраты машинистов, чел.-ч/ perators labour effort, manhour
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('labor_mechanics') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum.labor_mechanics"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum.labor_mechanics != getKs2TotalSum[0].labor_mechanics ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum', getKs2TotalSum, 'labor_mechanics', 'number', $event)"
            )
  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  //- Итого в том числе
  fieldset(class="mt-2 p-2 border rounded-sm border-border-color-primary")
    legend(class="flex items-center ml-2 px-2 text-sm font-bold") {{ $t('total-direct-dc-incl') }}
      div(class="w-5 h-5 flex items-center justify-center ml-2 border border-border-color-primary rounded-md ")
        svg-down(
          class="duration-300 cursor-pointer w-[17px]"
          :class="{'rotate-180': isOpenTotalIncl}"
          @click="isOpenTotalIncl = !isOpenTotalIncl"
        )
    div(
      v-if="getKs2TotalSum.length > 0"
      class="grid gap-2 text-[14px] transition-all duration-700 overflow-hidden"
      :class="isOpenTotalIncl ? 'max-h-[450px]' : 'max-h-0'"
      :style="gridStyle"
    )
      //- Итого по акту / Total on certificate
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('total_act') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.total_act"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.total_act != getKs2TotalSumIncl[0].total_act ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'total_act', 'number', $event)"
            )
      //- Итого по акту к оплате с учетом НДС 18%/Total on Certificate to be paid considering VAT 18 %
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('total_certificate_paid') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.total_certificate_paid"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.total_certificate_paid != getKs2TotalSumIncl[0].total_certificate_paid ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'total_certificate_paid', 'number', $event)"
            )
      //- Итого по акту с учетом НР и СП/Total on certificate considering Overheads and Estimated Profit
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('total_act_OEP') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.total_act_OEP"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.total_act_OEP != getKs2TotalSumIncl[0].total_act_OEP ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'total_act_OEP', 'number', $event)"
            )
      //- Итого по акту с учетом понижающего коэффициента 0,9318 / Certificate total with reduction coefficient 0,9318
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('act_total_reduction_coefficient') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.act_total_reduction_coefficient"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.act_total_reduction_coefficient != getKs2TotalSumIncl[0].act_total_reduction_coefficient ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'act_total_reduction_coefficient', 'number', $event)"
            )
      //- строительные работы/construction works
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('construction_works') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.construction_works"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.construction_works != getKs2TotalSumIncl[0].construction_works ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'construction_works', 'number', $event)"
            )
      //- монтажные работы/installation works
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('installation_works') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.installation_works"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.installation_works != getKs2TotalSumIncl[0].installation_works ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'installation_works', 'number', $event)"
            )
      //- оборудование/equipment
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('equipment') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.equipment"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.equipment != getKs2TotalSumIncl[0].equipment ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'equipment', 'number', $event)"
            )
      //- прочие работы и затраты/other works and costs
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('other_works_costs') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.other_works_costs"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.other_works_costs != getKs2TotalSumIncl[0].other_works_costs ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'other_works_costs', 'number', $event)"
            )
      //- накладные расходы и прибыль (25% от ПЗ)/Overheads and profit (25 % from DC)
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('overheads_profit') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.overheads_profit"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.overheads_profit != getKs2TotalSumIncl[0].overheads_profit ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'overheads_profit', 'number', $event)"
            )
      //- Оплата непредвиденных расходов и затрат, связанных с реализацией рисков Подрядчика / Contractor Risk Fee
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('contractor_risk') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.contractor_risk"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.contractor_risk != getKs2TotalSumIncl[0].contractor_risk ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'contractor_risk', 'number', $event)"
            )
      //- НДС 18% в соответствии с законодательством Турецкой Республики/VAT 18 % in accordance with the Law of Turkish Republic
      div.flex
        label(
          class="flex items-center select-none min-w-[130px] font-bold text-copy-primary"
        ) {{ $t('vat_turkish') }}:
        div.relative.flex.w-full
          input(
            v-model="ks2_total_sum_incl.vat_turkish"
            type="number"
            step=".01"
            class="bg-gray-200 appearance-none border-2 rounded w-full py-[2px] pr-0 text-copy-secondary"
            :class="readonly ? 'h-5' : 'pl-8'"
            :readonly="readonly"
          )
          div(v-if="!readonly" :class="ks2_total_sum_incl.vat_turkish != getKs2TotalSumIncl[0].vat_turkish ? 'text-red-400' : 'text-gray-500'")
            svg-refresh(
              class="cursor-pointer absolute left-0 top-0 mt-[4px] ml-1",
              @click="resetDefaultValue('ks2_total_sum_incl', getKs2TotalSumIncl, 'vat_turkish', 'number', $event)"
            )
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'ks2-total-sum',
  data() {
    return {
      readonly: true,
      isOpenTotal: true,
      isOpenTotalIncl: true,
      ks2_total_sum: {},
      ks2_total_sum_incl: {}
    }
  },
  computed: {
    ...mapGetters({
      getKs2TotalSum: 'ks2idModule/getKs2TotalSum',
      getIsLoading: 'ks2idModule/getIsLoading',
      getKs2TotalSumIncl: 'ks2idModule/getKs2TotalSumIncl'
    }),
    gridStyle() {
      let minmax = 250
      if(this.readonly) minmax = 230
      return 'grid-template-columns: repeat(auto-fit, minmax('+minmax+'px, 1fr));'
    },
  },
  methods: {
    ...mapActions({
      fetchKS2byId: 'ks2idModule/fetchKS2byId'
    }),
    resetDefaultValue(local_store, store, prop, type, event) {
      let el;
      event.target.localName === 'path' ? el = event.target.parentElement : el = event.target
      el.classList.add('animate-spin')
      setTimeout(() => { el.classList.remove('animate-spin') }, 500)
      if(type === 'date') {
        this[local_store][prop] = new Date(store[0][prop])
      } else {
        this[local_store][prop] = store[0][prop]
      }
    },
  }
}
</script>