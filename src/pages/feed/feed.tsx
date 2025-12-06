import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedThunk } from '../../services/feedSlice';

export const Feed: FC = () => {
  const { orders, isLoading } = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const handleGetFeeds = useCallback(() => {
    dispatch(getFeedThunk());
  }, [dispatch]);

  // if (!orders.length) {
  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
