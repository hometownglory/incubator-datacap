import LayoutContainer from "@/views/layout/Layout.vue";
import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Common from "@/common/Common";
import ProfileLayout from "@/views/pages/profile/layout/ProfileLayout.vue";

NProgress.configure({
  easing: 'ease',
  speed: 600,
  showSpinner: true,
  trickleSpeed: 200,
  minimum: 0.3
});

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: "/dashboard/index",
    component: LayoutContainer,
    children: []
  },
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: "/dashboard/index",
    component: LayoutContainer,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: "index",
        component: () => import("../views/pages/dashboard/DashboardConsole.vue")
      }
    ]
  },
  {
    path: "/console",
    name: "console",
    redirect: "/console/index",
    component: LayoutContainer,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        name: 'ConsoleIndex',
        path: "index",
        component: () => import("../views/pages/query/QueryHome.vue")
      }
    ]
  },
  {
    path: "/admin",
    name: "admin",
    component: LayoutContainer,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: "source",
        redirect: '/admin/source/index',
        children: [
          {
            path: "index",
            component: () => import("../views/pages/admin/source/SourceAdmin.vue")
          },
          {
            path: ":id/manager",
            component: () => import("../views/pages/admin/source/SourceManager.vue")
          }
        ]
      },
      {
        path: "history",
        component: () => import("../views/pages/query/QueryHistory.vue")
      },
      {
        path: "snippet",
        component: () => import("../views/pages/admin/snippet/SnippetAdmin.vue")
      },
      {
        path: "template",
        children: [
          {
            path: "sql",
            component: () => import("../views/pages/admin/template/sql/SqlAdmin.vue")
          }
        ]
      },
      {
        path: "settings",
        children: [
          {
            path: "function",
            component: () => import("@/views/pages/admin/settings/functions/FunctionsAdmin.vue")
          }
        ]
      },
      {
        path: "monitor",
        children: [
          {
            path: "processor",
            component: () => import("../views/pages/admin/monitor/processor/ProcessorAdmin.vue")
          }
        ]
      }
    ]
  },
  {
    path: '/profile',
    name: 'profile',
    redirect: '/profile/index',
    component: LayoutContainer,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '',
        component: ProfileLayout,
        children: [
          {
            path: 'index',
            component: () => import("../views/pages/profile/ProfileIndex.vue")
          },
          {
            path: 'public',
            component: () => import("../views/pages/profile/ProfilePublic.vue")
          },
          {
            path: 'log',
            component: () => import("../views/pages/profile/ProfileLog.vue")
          },
          {
            path: 'account',
            component: () => import("../views/pages/profile/ProfileAccount.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/common",
    name: "common",
    component: LayoutContainer,
    children: [
      {
        name: "routerNotFound",
        path: "not_found",
        component: () => import("../views/common/NotFound.vue")
      },
      {
        name: "routerNotAuthorized",
        path: "not_authorized",
        component: () => import("../views/common/NotAuthorized.vue")
      },
      {
        name: "routerNotNetwork",
        path: "not_network",
        component: () => import("../views/common/NotNetwork.vue")
      },
      {
        name: "about",
        path: "about",
        children: [
          {
            path: '',
            component: () => import("../views/common/CommonAbout.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/auth",
    name: "auth",
    children: [
      {
        name: "signin",
        path: "signin",
        component: () => import("../views/pages/auth/AuthSignin.vue")
      },
      {
        name: "signup",
        path: "signup",
        component: () => import("../views/pages/auth/AuthSignup.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

const authRouterWith = '/auth/sign';

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.matched.length === 0) {
    next({name: "routerNotFound"})
  }
  else {
    if (to.meta.requireAuth) {
      if (localStorage.getItem(Common.token)) {
        next();
      }
      else {
        next('/auth/signin');
      }
    }
    else {
      if (localStorage.getItem(Common.token) && to.path.startsWith(authRouterWith)) {
        next('/');
      }
      else {
        next();
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done();
});

export default router;
