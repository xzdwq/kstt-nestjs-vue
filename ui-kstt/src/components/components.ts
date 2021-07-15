import HeaderNavbar from "@/components/HeaderNavbar.vue";
import Logo from "@/components/Logo.vue";
import LocalesSwitcher from "@/components/LocalesSwitcher.vue"
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import BellNotification from "@/components/BellNotification.vue";
import CogSettings from "@/components/CogSettings.vue";
import NotificationItems from '@/components/NotificationItems.vue';
import TabsPanel from '@/components/tab/TabsPanel.vue';
import EpForm from '@/components/cogform/EpForm.vue';
import DefButton from '@/components/utils/DefButton.vue'

import Modal from "@/components/utils/Modal.vue";
import PopupNotification from "@/components/utils/PopupNotification.vue";

export default [
  HeaderNavbar,
  Logo,
  LocalesSwitcher,
  ThemeSwitcher,
  BellNotification,
  CogSettings,
  NotificationItems,
  TabsPanel,
  EpForm,
  DefButton,

  Modal,
  PopupNotification
];