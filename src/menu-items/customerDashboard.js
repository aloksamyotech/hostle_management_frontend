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
// ==============================|| SUB ADMIN USERS DASHBOARD MENU ITEMS ||============================== //
const subdashboard = {
  title: i18n.t('Dashboard-Menu'),
  type: 'Customer',
  children: [
    {
      id: 'default',
      title: i18n.t('Dashboard'),
      type: 'item',
      url: '/dashboard/default',
      icon: 'IconHome',
      breadcrumbs: false
    },
    {
      id: '01',
      title: i18n.t('Payments'),
      type: 'item',
      url: '/dashboard/payments',
      icon: 'IconReceipt',
      breadcrumbs: false
    },
    {
      id: '02',
      title: i18n.t('Room Details'),
      type: 'item',
      url: '/dashboard/room',
      icon: 'IconFileInvoice',
      breadcrumbs: false
    },
    {
      id: '03',
      title: i18n.t('Student Reservation'),
      type: 'item',
      url: '/dashboard/student_reservation',
      icon: 'IconUsers',
      breadcrumbs: false
    },
    {
      id: '04',
      title: i18n.t('Resident Complaints'),
      type: 'item',
      url: '/dashboard/complaints',
      icon: 'IconFileStack',
      breadcrumbs: false
    },
    {
      id: '05',
      title: i18n.t('Visitor Details'),
      type: 'item',
      url: '/dashboard/visitor',
      icon: 'IconMail',
      breadcrumbs: false
    },
    {
      id: '06',
      title: i18n.t('Inventory'),
      type: 'collapse',
      icon: 'IconCategory',
      children: [
        {
          id: '101',
          title: i18n.t('Canteen Inventory'),
          type: 'item',
          url: '/dashboard/canteen_inventory',
          icon: 'IconMenu',
          breadcrumbs: false
        },
        {
          id: '102',
          title: i18n.t('Purchase Inventory'),
          type: 'item',
          url: '/dashboard/purches_inventory',
          icon: 'IconMenu',
          breadcrumbs: false
        },
        {
          id: '103',
          title: i18n.t('Consume Inventory'),
          type: 'item',
          url: '/dashboard/consume_inventory',
          icon: 'IconMenu',
          breadcrumbs: false
        }
      ]
    },
    {
      id: '07',
      title: i18n.t('Expenditures'),
      type: 'item',
      url: '/dashboard/expenditures',
      icon: 'IconFileInvoice',
      breadcrumbs: false
    },
    {
      id: '08',
      title: i18n.t('Notice Board'),
      type: 'item',
      url: '/dashboard/notice_board',
      icon: 'IconNotification',
      breadcrumbs: false
    },
    {
      id: '09',
      title: i18n.t('Weekly Food Menu'),
      type: 'item',
      url: '/dashboard/weekly_foodmenu',
      icon: 'IconCategory',
      breadcrumbs: false
    },
    {
      id: '10',
      title: i18n.t('Room Type'),
      type: 'item',
      url: '/dashboard/type',
      icon: 'IconCategory',
      breadcrumbs: false
    }
  ]
};
export default subdashboard;
