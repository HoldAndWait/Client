import React from 'react';

const Community = () => {
  return (
    <div className="p-10 bg-blue-50 min-h-screen">
      <h1 className="text-4xl font-black text-blue-600 mb-4">
        커뮤니티 페이지
      </h1>
      <p className="text-gray-600 text-lg">
        라우터 이동 테스트 중입니다.
      </p>
      <button 
        onClick={() => window.location.href = "/"}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default Community;