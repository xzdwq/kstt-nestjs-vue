import axios from "axios";
import {
  createAttachedSignature,
  getUserCertificates,
  Certificate
} from 'crypto-pro';

export const cryptoConfigurationModule = {
  namespaced: true,
  state: () => ({
    tspService: "http://testca2012.cryptopro.ru/tsp/tsp.srf",
    isLoadCert: false,
    certificates: [],
    signatureType: [],
    defaultSignatureType: 4
  }),
  getters: {
    getIsLoadCert: (state) => state.isLoadCert,
    getCertificates(state) {
      return state.certificates
    },
    getTspService(state: any) {
      return state.tspService
    },
    getSignatureType(state: any) {
      return state.signatureType
    },
    getDefaultSignatureType(state: any) {
      return state.defaultSignatureType
    }
  },
  mutations: {
    setIsLoadCert(state, load) {
      state.isLoadCert = load
    },
    setCertificates(state, data) {
      state.certificates = data
    },
    setSignatureType(state, data) {
      state.signatureType = data
    },
    setDefaultSignatureType(state, id) {
      state.defaultSignatureType = id
    },
    setTspService(state, value) {
      state.tspService = value
    }
  },
  actions: {
    async fetchSignatureType({ state, commit}) {
      try {
        const data = await axios.get('api/cryptoconfig/signaturestype');
        commit('setSignatureType', data.data.data)
      }
      catch(e) {
        console.log(e)
      }
    },
    saveCogForm({ commit }, dataForm) {
      commit('setDefaultSignatureType', +dataForm.typeSignature)
      commit('setTspService', dataForm.tspService)
    },
    // Получение списка сертификатов пользователя
    async fillCertificates({ commit }) {
      commit('setIsLoadCert', true)
      commit('setCertificates', [])
      let certificates: Certificate[],
          data: any = []
      try {
        certificates = await getUserCertificates(true);
        for(let item of certificates) {
          const ownerInfo = await item.getOwnerInfo()
          data.push({
            serialNumber: await item._cadesCertificate.SerialNumber,
            isValid: await item.isValid(),
            issuerName: item.issuerName,
            name: item.name,
            subjectName: item.subjectName,
            thumbprint: item.thumbprint,
            validFrom: item.validFrom,
            validTo: item.validTo,
            issuerInfo: await item.getIssuerInfo(),
            company: ownerInfo.find(i => i.title === 'Компания')?.description,
            department: ownerInfo.find(i => i.title === 'Отдел/подразделение')?.description
          })
          data.sort((a, b) => {
            a = new Date(a.validFrom);
            b = new Date(b.validFrom);
            return a > b ? -1 : a < b ? 1 : 0;
          })
        }
        commit('setCertificates', data)
      } catch(e) {
        console.log(e)
      }
      finally {
        commit('setIsLoadCert', false)
      }
    },
    // Формирование подписи данных
    async signTestCreate({ commit }, params) {
      // console.log(params)
      let cert = params.cert
      try {
        const signData = await createAttachedSignature(cert.thumbprint, 'data-test')
        return {
          success: true,
          data: signData
        }
      } catch(e) {
        return {
          success: false,
          message: e.toString()
        }
      }
    }
  }
}