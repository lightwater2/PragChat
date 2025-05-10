import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * 타입이 지정된 useDispatch 훅
 * 기본 useDispatch 대신 이 훅을 사용하세요.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * 타입이 지정된 useSelector 훅
 * 기본 useSelector 대신 이 훅을 사용하세요.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;