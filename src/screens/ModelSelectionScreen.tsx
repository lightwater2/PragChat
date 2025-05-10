import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { createConversation, setSelectedModel } from '../state/slices/chatSlice';
import { store } from '../state/store';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { FEATURED_MODELS } from '../constants/llmModels';
import { RootStackParamList } from '../navigation/types';

/**
 * 모델 선택 화면 컴포넌트
 */
export const ModelSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const { selectedModelId } = useAppSelector((state) => state.chat);
  
  /**
   * 모델 선택 처리
   */
  const handleSelectModel = (modelId: string) => {
    dispatch(setSelectedModel(modelId));
  };
  
  /**
   * 선택한 모델로 새 대화 시작
   */
  const handleStartChat = () => {
    // 선택한 모델로 새 대화 생성
    dispatch(createConversation({}));
    
    // 새 대화 화면으로 이동
    setTimeout(() => {
      const state = store.getState();
      const currentConversationId = state.chat.currentConversationId;
      
      if (currentConversationId) {
        // 대화 화면으로 이동하고 모델 선택 화면을 네비게이션 스택에서 제거
        navigation.replace('Chat', { conversationId: currentConversationId });
      } else {
        navigation.navigate('Chat', { conversationId: 'new' });
      }
    }, 100);
  };
  
  /**
   * 모델 제공자별 아이콘 반환
   */
  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'anthropic':
        return '🟣'; // 보라색 원
      case 'openai':
        return '🟢'; // 초록색 원
      case 'google':
        return '🔵'; // 파란색 원
      case 'xai':
        return '⚫'; // 검은색 원
      case 'perplexity':
        return '🟠'; // 주황색 원
      case 'deepseek':
        return '🟡'; // 노란색 원
      default:
        return '⚪'; // 흰색 원
    }
  };
  
  /**
   * 모델 항목 렌더링
   */
  const renderModelItem = ({ item }: { item: typeof FEATURED_MODELS[0] }) => {
    const isSelected = item.id === selectedModelId;
    
    return (
      <TouchableOpacity
        style={[
          styles.modelItem,
          isDarkMode ? styles.modelItemDark : {},
          isSelected ? styles.modelItemSelected : {},
          isSelected && isDarkMode ? styles.modelItemSelectedDark : {},
        ]}
        onPress={() => handleSelectModel(item.id)}
      >
        <View style={styles.modelHeader}>
          <Text style={styles.providerIcon}>{getProviderIcon(item.provider)}</Text>
          <Text
            style={[
              styles.modelName,
              isDarkMode ? styles.textDark : {},
              isSelected ? styles.textSelected : {},
            ]}
          >
            {item.name}
          </Text>
          {isSelected && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={Colors.primary}
              style={styles.checkIcon}
            />
          )}
        </View>
        
        <Text
          style={[
            styles.modelProvider,
            isDarkMode ? styles.textSecondaryDark : {},
          ]}
        >
          {item.provider}
        </Text>
        
        <Text
          style={[
            styles.modelDescription,
            isDarkMode ? styles.textSecondaryDark : {},
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
      ]}
    >
      <Text
        style={[
          styles.title,
          isDarkMode ? styles.textDark : {},
        ]}
      >
        AI 모델 선택
      </Text>
      
      <Text
        style={[
          styles.subtitle,
          isDarkMode ? styles.textSecondaryDark : {},
        ]}
      >
        대화에 사용할 AI 모델을 선택하세요
      </Text>
      
      <FlatList
        data={FEATURED_MODELS}
        renderItem={renderModelItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.modelList}
      />
      
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartChat}
      >
        <Text style={styles.startButtonText}>
          선택한 모델로 대화 시작
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightTheme.background,
    padding: 16,
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: Colors.textSecondary,
  },
  modelList: {
    paddingBottom: 16,
  },
  modelItem: {
    backgroundColor: Colors.lightTheme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
  },
  modelItemDark: {
    backgroundColor: Colors.darkTheme.surface,
    borderColor: Colors.darkTheme.border,
  },
  modelItemSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  modelItemSelectedDark: {
    borderColor: Colors.primary,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  modelProvider: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  modelDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  checkIcon: {
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
  textSelected: {
    color: Colors.primary,
  },
});