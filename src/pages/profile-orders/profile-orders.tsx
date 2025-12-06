import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrdersThunk, isUserOrders } from '../../services/ordersSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector((store) => store.orders.userOrders);
  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();

  // запрашиваю у сервера заказы пользователя непосредственно там,
  // где они будут запрошенны из локального стора с кросчеком, т.е.
  // на случай если сюда прийдут перепрыгнув /profile
  const isOders = useSelector(isUserOrders);
  useEffect(() => {
    if (user && !isOders) {
      dispatch(getUserOrdersThunk());
    }
  }, [user, isOders, dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
