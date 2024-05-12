import {
  history,
  useAppData,
  useIntl,
  useLocation,
  useOutlet,
  useSelectedRoutes,
} from '@umijs/max';
import { useCallback, useEffect, useState } from 'react';

interface MatchRouteType {
  title: string;
  pathname: string;
  children: any;
  routePath: string;
  icon?: any;
}

export const useMatchRoute = () => {
  const seletedRoutes = useSelectedRoutes();
  const children = useOutlet();
  const { routes } = useAppData();
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const [matchRoute, setMatchRoute] = useState<MatchRouteType | undefined>();

  const getMenuTitle = useCallback(
    (lastRoute: any) => {
      let curRoute = lastRoute.route;
      const names = ['menu'];
      while (curRoute.parentId && !curRoute.isLayout) {
        const parentRoute = routes[curRoute.parentId];
        if (parentRoute?.name) {
          names.push(parentRoute.name);
        } else {
          break;
        }
        curRoute = parentRoute;
      }

      names.push(lastRoute.route.name);

      return formatMessage({ id: names.join('.') });
    },
    [routes],
  );

  useEffect(() => {
    const lastRoute = seletedRoutes.at(-1);
    if (!lastRoute?.route?.path) return;
    const routeDetail = routes[lastRoute.route.id];
    if (routeDetail?.redirect) {
      history.replace(routeDetail?.redirect);
      return;
    }
    const title = getMenuTitle(lastRoute);
    setMatchRoute({
      title,
      pathname,
      children,
      routePath: lastRoute.route.path,
      icon: (lastRoute.route as any).icon,
    });
  }, [pathname]);

  return matchRoute;
};
