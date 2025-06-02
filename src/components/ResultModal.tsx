// src/components/ResultModal.tsx

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: string;
}

export default function ResultModal({ isOpen, onClose, winner }: CustomModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-20 flex items-center justify-center" onClose={onClose}>
        {/* 1) div로 배경 오버레이 만들기 */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose} // 바깥(dark overlay) 클릭 시 모달 닫기
        />

        {/* 2) 모달 박스 */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 z-30 w-11/12 max-w-md mx-auto text-center">
          <Dialog.Title as="h3" className="text-2xl font-bold text-white mb-4">
           {winner} 당첨!!
          </Dialog.Title>
          <Dialog.Description className="text-indigo-300 mb-6">
            즐거운 식사 되세요! 😋
          </Dialog.Description>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600"
          >
            닫기
          </button>
        </div>
      </Dialog>
    </Transition>
  );
}
