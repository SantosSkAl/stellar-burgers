import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getUserThunk } from '../../services/userSlice';
import { getIngredientsThunk } from '../../services/ingredientsSlice';
import { getFeedThunk } from '../../services/feedSlice';
import { getUserOrdersThunk } from '../../services/ordersSlice';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserThunk());
    dispatch(getIngredientsThunk());
    // данные (если они не супер большие) стараюсь подгрузить когда пользователь
    // от них в одном клике (чтобы меньше загрузок пользователь наблюдал),
    // вот например тут, лента заказов в одном клике от главной - гружу с сервара сразу.
    // Заказы пользователя, утащил в компоненты /profile и /profile/orders, ниже дал комент.
    // Имеет право на жизнь?
    dispatch(getFeedThunk());
  }, [dispatch]);

  // Когда, вы итоге, поместил getUserOrdersThunk() сюда в app , логика была такая:
  // Хочу показывать пользователю как можно меньше лоадеров, значит надо расставить этот вызов
  // по тем местам, что находятся в одном клике от отрисовки, т.е в даном случае в
  // компонет обслуживающий /profile, но всплылы нюансы с авторизацией и
  // перенаправлениями, например корнер кейс: пользователь зайдет на страницу со своими
  // заказами => нажмет "выйти" => будет перекинут на страницу логина => залогинится под другим
  // акком => система вернет его на страницу с личными заказами /profile/orders, перепригнув
  // при этом /profile... значит логику запроса getUserOrdersThunk() я также должен поставить и в
  // местах непосредственного использования заказов пользователя. Также, чтобы не дергать много
  // раз сервер нужна проверка есть ли у меня уже эти данные для этого пользователя т.е еще кросчеки.
  // В сухом остатке:
  // 1) если все тащить в app:
  //  + логика подгрузки ассетов не усложняется и не расползается по приложению;
  //  + пользователь видит минимум прелоадеров;
  //  - нагрузка на приложение и сервер потенциально лишними запросами.
  // 2) если делать запрос для каждого ассета прям по месту использования:
  //  +/- логика подгрузки ассетов умеренно расползается по приложению;
  //  - пользователь видит максимум прелоадеров;
  //  + только необходимые запросы на сервер.
  // 3) если делать запрос для каждого ассета прям по месту использования + в одном клике:
  //  - логика подгрузки ассетов сильно расползается по приложению и обастает кросчеками;
  //  + пользователь видит миниимум прелоадеров;
  //  + только необходимые запросы на сервер.
  // Получается у меня был вариант "1", а сейчас я переделал под "3". Не могли бы вы
  // порекоментовать что-то по поводу вышеописанного из личного опыта или может хорошие
  // материалы по теме порекомендоать
  // useEffect(() => {
  //   if (user) {
  //     dispatch(getUserOrdersThunk());
  //   }
  // }, [user, dispatch]);

  const handleCloseModal = () => {
    navigate(background, { replace: true });
  }; // либо можно вручную каждой модалке указать куда navigate

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${feedMatch}`} onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали инградиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={`#${profileMatch}`} onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
