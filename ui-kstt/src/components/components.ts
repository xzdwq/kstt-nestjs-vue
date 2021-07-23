/**
 * Components
 */
import HeaderNavbar from "@/components/HeaderNavbar.vue"
import CompanyLogo from "@/components/CompanyLogo.vue"
import LocalesSwitcher from "@/components/LocalesSwitcher.vue"
import ThemeSwitcher from "@/components/ThemeSwitcher.vue"
import BellNotification from "@/components/BellNotification.vue"
import CogSettings from "@/components/CogSettings.vue"
import NotificationItems from '@/components/NotificationItems.vue'
import TabsPanel from '@/components/tab/TabsPanel.vue'
import SignatureForm from '@/components/cogform/SignatureForm.vue'
import DefButton from '@/components/utils/DefButton.vue'
import CreateKS3 from '@/components/createKS3form/CreateKS3.vue'
import KS3Items from '@/components/KS3Items.vue'
/**
 * SVG icons
 */
import Loading from '@/components/svg/Loading.vue'
import Bell from '@/components/svg/Bell.vue'
import Cog from '@/components/svg/Cog.vue'
import Logo from '@/components/svg/Logo.vue'
import Sun from '@/components/svg/Sun.vue'
import Moon from '@/components/svg/Moon.vue'
import Calendar from '@/components/svg/Calendar.vue'
import Close from '@/components/svg/Close.vue'
import DocumentAdd from '@/components/svg/DocumentAdd.vue'
import Refresh from '@/components/svg/Refresh.vue'
/**
 * Utils
 */
import Modal from "@/components/utils/Modal.vue"
import PopupNotification from "@/components/utils/PopupNotification.vue"

export default [
  HeaderNavbar,
  CompanyLogo,
  LocalesSwitcher,
  ThemeSwitcher,
  BellNotification,
  CogSettings,
  NotificationItems,
  TabsPanel,
  SignatureForm,
  DefButton,
  CreateKS3,
  KS3Items,

  Loading,
  Bell,
  Cog,
  Logo,
  Sun,
  Moon,
  Calendar,
  Close,
  DocumentAdd,
  Refresh,

  Modal,
  PopupNotification
];