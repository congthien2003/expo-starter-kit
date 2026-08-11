import { Ionicons } from '@expo/vector-icons';
import { PropsWithChildren, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Typography } from '@/components/ui/typography';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center gap-2"
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#475569"
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <Typography weight="semibold">{title}</Typography>
      </TouchableOpacity>
      {isOpen && <View className="ml-6 mt-2">{children}</View>}
    </View>
  );
}
