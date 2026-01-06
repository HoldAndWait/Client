import { configureStore } from '@reduxjs/toolkit';

// 임시 스토어 생성
const store = configureStore({
  reducer: {
    // 여기에 리듀서들을 추가하게 됩니다.
  },
});

export default store;