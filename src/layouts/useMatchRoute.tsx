import {
  IRoute,
  history,
  useAppData,
  useIntl,
  useLocation,
  useOutlet,
  useSelectedRoutes,
} from '@umijs/max';
import { useEffect, useState } from 'react';

type CustomIRoute = IRoute & {
  name: string;
};

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
  console.log(seletedRoutes, 'seletedRoutes');
  const getMenuTitle = (lastRoute: any) => {
    let curRoute = lastRoute.route;
    let names = ['menu'];
    while (curRoute.parentId && !curRoute.isLayout) {
      if ((routes[curRoute.parentId] as CustomIRoute).name) {
        names.push((routes[curRoute.parentId] as CustomIRoute).name);
      } else {
        break;
      }
      curRoute = routes[curRoute.parentId];
    }

    names.push(lastRoute.route.name);

    return formatMessage({ id: names.join('.') });
  };

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
