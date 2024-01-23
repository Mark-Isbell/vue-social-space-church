import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";
import LandingPage from "../views/LandingPage.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landingpage",
      component: LandingPage,
    },
    {
      path: "/main",
      name: "main",
      component: Main,
    },
    /*
    MEMBER VIEW ROUTE MAPPINGS
    */
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("../views/Logout.vue"),
    },
    {
      path: "/createaccountuser",
      name: "createaccountuser",
      component: () => import("../views/CreateAccountUser.vue"),
    },
    {
      path: "/createaccountuseremail",
      name: "createaccountuseremail",
      component: () => import("../views/CreateAccountUserEmail.vue"),
    },
    {
      path: "/createaccountuseremailconfirmed",
      name: "createaccountuseremailconfirmed",
      component: () => import("../views/CreateAccountUserEmailConfirmed.vue"),
    },
    {
      path: "/codeexplained",
      name: "codeexplained",
      component: () => import("../views/CodeExplained.vue"),
    },
    {
      path: "/catcher",
      name: "catcher",
      component: () => import("../views/Catcher.vue"),
    },
    {
      path: "/errorpage",
      name: "errorpage",
      component: () => import("../views/ErrorPage.vue"),
    },
    {
      path: "/catcherpasswordreset",
      name: "catcherpasswordreset",
      component: () => import("../views/CatcherPasswordReset.vue"),
    },
    {
      path: "/accountinfo",
      name: "accountinfo",
      component: () => import("../views/AccountInformation.vue"),
    },
    {
      path: "/accountsecurity",
      name: "accountsecurity",
      component: () => import("../views/AccountSecurity.vue"),
    },
    {
      path: "/memberprofile",
      name: "memberprofile",
      component: () => import("../views/MemberProfile.vue"),
    },
    {
      path: "/memberphoto",
      name: "memberphoto",
      component: () => import("../views/MemberPhoto.vue"),
    },
    {
      path: "/introduction",
      name: "introduction",
      component: () => import("../views/Introduction.vue"),
    },
    {
      path: "/facts",
      name: "facts",
      component: () => import("../views/Facts.vue"),
    },
    {
      path: "/requestpasswordreset",
      name: "requestpasswordreset",
      component: () => import("../views/RequestPasswordReset.vue"),
    },
    {
      path: "/directmessages",
      name: "directmessages",
      component: () => import("../views/DirectMessages.vue"),
    },
    /*
    CHURCH VIEW ROUTE MAPPINGS
    */
    {
      path: "/churchinvitecode",
      name: "churchinvitecode",
      component: () => import("../views/ChurchInviteCode.vue"),
    },
    {
      path: "/churchinfo",
      name: "churchinfo",
      component: () => import("../views/ChurchInfo.vue"),
    },
    {
      path: "/churchfacts",
      name: "churchfacts",
      component: () => import("../views/ChurchFacts.vue"),
    },
    {
      path: "/churchmoderation",
      name: "churchmoderation",
      component: () => import("../views/ChurchModeration.vue"),
    },
    {
      path: "/churchmembers",
      name: "churchmembers",
      component: () => import("../views/ChurchMembers.vue"),
    },
    {
      path: "/churchlinks",
      name: "churchlinks",
      component: () => import("../views/ChurchLinks.vue"),
    },
    {
      path: "/calendar/:month/:year",
      name: "calendar",
      component: () => import("../views/ChurchCalendar.vue") 
    },
    /*
    MODERATOR VIEW ROUTE MAPPINGS
    */
    {
      path: "/reportdecision",
      name: "reportdecision",
      component: () => import("../views/ReportDecision.vue"),
    },
    {
      path: "/reports",
      name: "reports",
      component: () => import("../views/Reports.vue"),
    },
    {
      path: "/restrictions",
      name: "restrictions",
      component: () => import("../views/Restrictions.vue"),
    },
    {
      path: "/createnewstream",
      name: "createnewstream",
      component: () => import("../views/CreateNewStream.vue"),
    },
    {
      path: "/accessrequests",
      name: "accessrequests",
      component: () => import("../views/AccessRequests.vue"),
    },
    {
      path: "/updatestream",
      name: "updatestream",
      component: () => import("../views/UpdateStream.vue"),
    },
    {
      path: "/updatechurch",
      name: "updatechurch",
      component: () => import("../views/UpdateChurch.vue"),
    },
    {
      path: "/updatechurchfacts",
      name: "updatechurchfacts",
      component: () => import("../views/UpdateChurchFacts.vue"),
    },
    {
      path: "/updatechurchlinks",
      name: "updatechurchlinks",
      component: () => import("../views/UpdateChurchLinks.vue"),
    },
    {
      path: "/churchmoderationmaintenance",
      name: "churchmoderationmaintenance",
      component: () => import("../views/ChurchModerationMaintenance.vue"),
    },
    {
      path: "/promotemoderator",
      name: "promotemoderator",
      component: () => import("../views/PromoteModerator.vue"),
    },
    {
      path: "/addtostream",
      name: "addtostream",
      component: () => import("../views/AddToStream.vue"),
    }
  ],
});

// FRONT END SECURITY

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page 
    const auth = useAuthStore();
    auth.pathHistory.push(to.name);
    
    const authRequired = !auth.publicPages.includes(to.name);
    
    if (authRequired && !auth.member) {
        auth.returnUrl = to.fullPath;
        return '/login';
    } 
    if(authRequired && auth.member) {
          // return error page for unverified if to name not in unverified array
          if(auth.member.role==='unverified' && !auth.unverifiedPages.includes(to.name)){
            return '/errorpage';}
          // return error page for verified if to name not in verified array
          if(auth.member.role==='verified' && !auth.verifiedPages.includes(to.name)){
            return '/errorpage';}
          // return error page for member if to name not in member array
          if(auth.member.role==='member' && !auth.memberPages.includes(to.name)){
            return '/errorpage';}
          // return error page for moderator if to name not in moderator array
          if(auth.member.role==='moderator' && !auth.moderatorPages.includes(to.name)){
            return '/errorpage';}
          // Done checking for problems.  Now navigate.
    }

});

export default router;
