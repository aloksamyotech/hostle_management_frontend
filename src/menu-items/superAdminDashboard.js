// assets
import {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconUser,
  IconFileStack,
  IconNotification,
  IconMenu,
  IconCategory,
  IconReceipt,
  IconUserPlus
} from '@tabler/icons';

// constant
const icons = {
  IconHome,
  IconCalendarEvent,
  IconMail,
  IconFileUpload,
  IconFileInvoice,
  IconPhoneCall,
  IconAntennaBars5,
  IconChecklist,
  IconNotebook,
  IconPhoneCheck,
  IconUsers,
  IconUser,
  IconFileStack,
  IconNotification,
  IconMenu,
  IconCategory,
  IconReceipt,
  IconUserPlus
};
import i18n from 'i18n';
// ==============================|| SUPER ADMIN DASHBOARD MENU ITEMS ||============================== //

const superdashboard = {
  title: i18n.t('Dashboard-Menu'),
  type: 'SuperAdmin',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/superadmindashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: '01',
      title: i18n.t('Hostel Details'),
      type: 'item',
      url: '/superadmindashboard/hostel',
      icon: icons.IconNotebook,
      breadcrumbs: false
    }
    // {
    //   id: '02',
    //   title: 'Hostel Administrators',
    //   type: 'item',
    //   url: '/superadmindashboard/administrator',
    //   icon: icons.IconUserPlus,
    //   breadcrumbs: false
    // }
  ]
};
export default superdashboard;
