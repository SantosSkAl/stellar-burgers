import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearOrderModal, orderBurgerThunk } from '../../services/burgerSlice';
import { Navigate, useLocation, useNavigate } from 'react-router';

export const BurgerConstructor: FC = () => {
  const { constructorItems, orderRequest, orderModalData } = useSelector(
    (store) => store.burger
  );
  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', {
        replace: true,
        state: { from: location }
      });
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    // const orderArray: string[] = [constructorItems.bun._id];
    // constructorItems.ingredients.forEach((ingredient) =>
    //   orderArray.push(ingredient._id)
    // );
    // dispatch(orderBurgerThunk(orderArray));
    dispatch(orderBurgerThunk());
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
