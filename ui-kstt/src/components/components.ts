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
import CreateKS3 from '@/components/KS3/CreateKS3.vue'
import KS3Items from '@/components/KS3Items.vue'
import StageWorkflow from '@/components/StageWorkflow.vue'
import DefSearch from '@/components/utils/DefSearch.vue'
import DefPagination from '@/components/utils/DefPagination.vue'
import MetaDataKS3 from '@/components/KS3/MetaDataKS3.vue'
import KS2Form from '@/components/KS2/KS2Form.vue'
import DropdownMenu from '@/components/utils/DropdownMenu.vue'
import WorkflowManagment from '@/components/WorkflowManagment.vue'
import DefButtonBack from '@/components/utils/DefButtonBack.vue'
import AddGroupInStageForm from '@/components/workflow/AddGroupInStageForm.vue'
import EditGroupInStageForm from '@/components/workflow/EditGroupInStageForm.vue'
import DeleteGroupInStage from '@/components/workflow/DeleteGroupInStage.vue'
import DefAddGroupInStageForm from '@/components/workflow/default/DefAddGroupInStageForm.vue'
import DefEditGroupInStageForm from '@/components/workflow/default/DefEditGroupInStageForm.vue'
import ElectronicSignature from '@/components/crypto/ElectronicSignature.vue'
import Login from '@/views/Login.vue'
import LogoutDef from '@/components/Logout.vue'
import DefAddUserInGroup from '@/components/workflow/default/DefAddUserInGroup.vue'
import GroupEdit from '@/components/workflow/default/GroupEdit.vue'
import DefCreateGroup from '@/components/workflow/default/DefCreateGroup.vue'
import KS2Item from '@/components/KS2/KS2Item.vue'
import ContextMenu from '@/components/utils/ContextMenu.vue'
import AddUserInGroup from '@/components/workflow/AddUserInGroup.vue'
import KS2Metadata from '@/components/KS2/KS2Metadata.vue'
import PdfViewer from '@/components/PdfViewer.vue'
import Confirm from '@/components/utils/Confirm.vue'
import KS2TotalSum from '@/components/KS2/KS2TotalSum.vue'
import VersionArchive from '@/components/KS2/VersionArchive.vue'
import OtherFiles from '@/components/KS2/OtherFiles.vue'
import TableHeader from '@/components/utils/TableHeader.vue'
import ModalExclamation from '@/components/KS2/ModalExclamation.vue'
import RoleManagment from '@/components/RoleManagment.vue'
import AddUserRole from '@/components/AddUserRole.vue'
import ModalAgree from '@/components/KS2/ModalAgree.vue'
import KS2Agreements from '@/components/KS2/KS2Agreements.vue'
import AddExtraApprover from '@/components/KS2/AddExtraApprover.vue'
import CreateRemark from '@/components/KS2/CreateRemark.vue'
import History from '@/components/KS2/History.vue'
import KS2Sign from '@/components/KS2/KS2Sign.vue'
import ModalExclamationSign from '@/components/KS2/ModalExclamationSign.vue'
import ViewTwoPdf from '@/components/KS2/ViewTwoPdf.vue'
import Notes from '@/components/KS2/Notes.vue'
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
import Star from '@/components/svg/Star.vue'
import PaperClip from '@/components/svg/PaperClip.vue'
import Search from '@/components/svg/Search.vue'
import Check from '@/components/svg/Check.vue'
import DoubleRight from '@/components/svg/DoubleRight.vue'
import DoubleLeft from '@/components/svg/DoubleLeft.vue'
import Left from '@/components/svg/Left.vue'
import Right from '@/components/svg/Right.vue'
import NewsPaper from '@/components/svg/NewsPaper.vue'
import Exclamation from '@/components/svg/Exclamation.vue'
import External from '@/components/svg/External.vue'
import Down from '@/components/svg/Down.vue'
import Upload from '@/components/svg/Upload.vue'
import Document from '@/components/svg/Document.vue'
import UsersGroup from '@/components/svg/UsersGroup.vue'
import Plus from '@/components/svg/Plus.vue'
import ViewGrid from '@/components/svg/ViewGrid.vue'
import ViewList from '@/components/svg/ViewList.vue'
import UserPlus from '@/components/svg/UserPlus.vue'
import UserMinus from '@/components/svg/UserMinus.vue'
import Trash from '@/components/svg/Trash.vue'
import ViewGridPlus from '@/components/svg/ViewGridPlus.vue'
import Pencilalt from '@/components/svg/Pencilalt.vue'
import Question from '@/components/svg/Question.vue'
import Hand from '@/components/svg/Hand.vue'
import Collection from '@/components/svg/Collection.vue'
import Selector from '@/components/svg/Selector.vue'
import Translate from '@/components/svg/Translate.vue'
import BadgeCheck from '@/components/svg/BadgeCheck.vue'
import Logout from '@/components/svg/Logout.vue'
import DotsVertical from '@/components/svg/DotsVertical.vue'
import Excel from '@/components/svg/Excel.vue'
import Download from '@/components/svg/Download.vue'
import Eye from '@/components/svg/Eye.vue'
import Pdf from '@/components/svg/Pdf.vue'
import Archive from '@/components/svg/Archive.vue'
import Minus from '@/components/svg/Minus.vue'
import SortAsc from '@/components/svg/SortAsc.vue'
import SortDesc from '@/components/svg/SortDesc.vue'
import Save from '@/components/svg/Save.vue'
import Users from '@/components/svg/Users.vue'
import BadgeTwoTape from '@/components/svg/BadgeTwoTape.vue'
import BadgeOneTape from '@/components/svg/BadgeOneTape.vue'
import Mail from '@/components/svg/Mail.vue'
import MailOpen from '@/components/svg/MailOpen.vue'
import InformationCircle from '@/components/svg/InformationCircle.vue'
import PapperAirplane from '@/components/svg/PapperAirplane.vue'
import DocumentText from '@/components/svg/DocumentText.vue'
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
  StageWorkflow,
  DefSearch,
  DefPagination,
  MetaDataKS3,
  KS2Form,
  DropdownMenu,
  WorkflowManagment,
  DefButtonBack,
  AddGroupInStageForm,
  EditGroupInStageForm,
  DeleteGroupInStage,
  DefAddGroupInStageForm,
  DefEditGroupInStageForm,
  ElectronicSignature,
  Login,
  LogoutDef,
  DefAddUserInGroup,
  GroupEdit,
  DefCreateGroup,
  KS2Item,
  ContextMenu,
  AddUserInGroup,
  KS2Metadata,
  PdfViewer,
  Confirm,
  KS2TotalSum,
  VersionArchive,
  OtherFiles,
  TableHeader,
  ModalExclamation,
  RoleManagment,
  AddUserRole,
  ModalAgree,
  KS2Agreements,
  AddExtraApprover,
  CreateRemark,
  History,
  KS2Sign,
  ModalExclamationSign,
  ViewTwoPdf,
  Notes,

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
  Star,
  PaperClip,
  Search,
  Check,
  DoubleRight,
  DoubleLeft,
  Left,
  Right,
  NewsPaper,
  Exclamation,
  External,
  Down,
  Upload,
  Document,
  UsersGroup,
  Plus,
  ViewGrid,
  ViewList,
  UserPlus,
  UserMinus,
  Trash,
  ViewGridPlus,
  Pencilalt,
  Question,
  Hand,
  Collection,
  Selector,
  Translate,
  BadgeCheck,
  Logout,
  DotsVertical,
  Excel,
  Download,
  Eye,
  Pdf,
  Archive,
  Minus,
  SortAsc,
  SortDesc,
  Save,
  Users,
  BadgeTwoTape,
  BadgeOneTape,
  Mail,
  MailOpen,
  InformationCircle,
  PapperAirplane,
  DocumentText,

  Modal,
  PopupNotification
];