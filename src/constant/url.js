import { Upload } from '@mui/icons-material';
import SuperAdminDashboard from 'views/SuperAdminDashboard/Default';

const base = 'http://localhost:4000';
const baseDashboard = '/dashboard';

export const url = {
  dashboard: {
    studentReservation: `${base}/sudent_reservation/index/`,
    totalRooms: `${base}/room/index/`,
    allExpenses: `${base}/expense/allexpenses/`,
    allComplaints: `${base}/student_complaint/allComplaints/`,
    tstudentReservation: `${base}/sudent_reservation/`,
    room: `${baseDashboard}/room`,
    studentReservationPage: `${baseDashboard}/student_reservation/`
  },
  canteenInventory: {
    index: `${base}/canteen_inventory/index/`,
    add: `${base}/canteen_inventory/add/`,
    edit: `${base}/canteen_inventory/edit/`,
    delete: `${base}/canteen_inventory/delete/`,
    importFile: `${base}/canteen_inventory/importFile/`
  },

  purchaseInventory: {
    index: `${base}/canteen_inventory_purches/index/`,
    add: `${base}/canteen_inventory_purches/add/`,
    edit: `${base}/canteen_inventory_purches/edit/`,
    delete: `${base}/canteen_inventory_purches/delete/`,
    purchaseitem: `${base}/canteen_inventory/index/`
  },

  consumptionInventory: {
    index: `${base}/canteen_inventory_consume/index/`,
    add: `${base}/canteen_inventory_consume/add/`,
    edit: `${base}/canteen_inventory_consume/edit/`,
    delete: `${base}/canteen_inventory_consume/delete/`
  },
  payments: {
    index: `${base}/sudent_reservation/index/`,
    add: `${base}/student_payment/add/`,
    list: `${base}/student_payment/list/`
  },
  room: {
    index: `${base}/room/index/`,
    add: `${base}/room/add/`,
    edit: `${base}/room/edit/`,
    delete: `${base}/room/deleteData/`,
    view: `${base}/room/view/`,
    gettype: `${base}/room/gettype/`,
    roomimages: `${base}/uploads/RoomImages/`
  },
  studentReservation: {
    index: `${base}/sudent_reservation/index/`,
    add: `${base}/sudent_reservation/add/`,
    edit: `${base}/sudent_reservation/edit/`,
    delete: `${base}/sudent_reservation/deleteData/`,
    viewProfile: `${baseDashboard}/student_reservation/view_profile/`,
    updateStatus: `${base}/sudent_reservation/updateStatus/`,
    Uploadstudent: `${base}/uploads/students/`,
    view: `${base}/sudent_reservation/view/`,
    paymenthistory: `${base}/student_payment/paymenthistory/`,
    visitorlist: `${base}/visitor/list/`
  },

  studentComplaint: {
    indexx: `${base}/sudent_reservation/index/`,
    add: `${base}/student_complaint/add/`,
    edit: `${base}/student_complaint/edit/`,
    delete: `${base}/student_complaint/deleteData/`,
    index: `${base}/student_complaint/index/`
  },

  visitor: {
    index: `${base}/visitor/index/`,
    add: `${base}/visitor/add/`,
    edit: `${base}/visitor/edit/`,
    delete: `${base}/visitor/deleteData/`
  },
  expenditure: {
    index: `${base}/expense/index/`,
    delete: `${base}/expense/delete/`,
    edit: `${base}/expense/edit/`,
    add: `${base}/expense/add/`
  },
  notice: {
    fetchAll: `${base}/notice_board/index/`,
    add: `${base}/notice_board/add/`,
    edit: `${base}/notice_board/edit/`,
    delete: `${base}/notice_board/delete/`
  },
  roomtype: {
    getType: `${base}/room/gettype/`,
    addType: `${base}/room/type/`,
    delete: `${base}/room/delet/`
  },
  foodMenu: {
    index: `${base}/weeklyfoodmenu/index/`,
    add: `${base}/weeklyfoodmenu/add/`,
    edit: `${base}/weeklyfoodmenu/edit/`,
    delete: `${base}/weeklyfoodmenu/delete/`
  },

  weeklyFoodMenu: {
    index: `${base}/weeklyfoodmenu/index/`,
    add: `${base}/weeklyfoodmenu/add/`,
    edit: `${base}/weeklyfoodmenu/edit/`,
    delete: `${base}/weeklyfoodmenu/delete/`
  },

  SuperAdminDashboard: {
    hostelList: `${base}/hostel/list`,
    adminList: `${base}/administrator/list`,
    studentCount: `${base}/student/allStudentCount`,
    allRooms: `${base}/room/alRooms`,
    calculateBeds: `${base}/room/calculate-beds`
  },
  Hostels: {
    edit: `${base}/hostel/edit/`,
    add: `${base}/hostel/addnew`,
    delete: `${base}/hostel/delete/`,
    list: `${base}/hostel/list`,
    view: `${base}/hostel/view/`
  },
  ragistraion: {
    login: `${base}/administrator/login`
  }
};

export default url;
