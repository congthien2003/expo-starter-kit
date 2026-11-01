import React from 'react';
import { Modal as RNModal, View, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from './typography';
interface ModalProps {
  visible: boolean; onClose: () => void; title?: string; children: React.ReactNode;
  variant?: 'center' | 'bottom'; showCloseButton?: boolean; closeOnBackdrop?: boolean; scrollable?: boolean;
}
export function Modal({ visible, onClose, title, children, variant = 'center', showCloseButton = true, closeOnBackdrop = true, scrollable = true }: ModalProps) {
  const insets = useSafeAreaInsets();
  return <RNModal visible={visible} transparent animationType={variant === 'bottom' ? 'slide' : 'fade'} onRequestClose={onClose}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View className={`flex-1 bg-black/50 ${variant === 'bottom' ? 'justify-end' : 'justify-center items-center'}`}>
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss dialog" disabled={!closeOnBackdrop} onPress={onClose} className="absolute inset-0" />
        <View accessibilityViewIsModal className={`bg-white ${variant === 'bottom' ? 'w-full rounded-t-3xl max-h-[90%]' : 'w-[90%] max-w-md rounded-2xl max-h-[80%]'}`} style={{ paddingBottom: insets.bottom }}>
          {(title || showCloseButton) ? <View className="flex-row items-center px-4 py-4 border-b border-neutral-200">
            <Typography variant="h4" className="flex-1">{title || ''}</Typography>
            {showCloseButton ? <Pressable accessibilityRole="button" accessibilityLabel="Close dialog" hitSlop={12} onPress={onClose} className="p-2"><Ionicons name="close" size={24} color="#475569" /></Pressable> : null}
          </View> : null}
          {scrollable ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }} style={{ flexShrink: 1 }}>{children}</ScrollView> : <View className="p-4">{children}</View>}
        </View>
      </View>
    </KeyboardAvoidingView>
  </RNModal>;
}
export default Modal;
