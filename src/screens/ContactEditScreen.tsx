import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Switch,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { MainStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { updateContact, setContactOnlineStatus } from '../state/slices/contactsSlice';
import { REQUESTY_MODELS } from '../constants/llmModels';
import { SystemMessage, formatSystemPrompt } from '../types/contact';

/**
 * 시스템 프롬프트 내용을 문자열로 변환
 */
const getSystemPromptContent = (systemPrompt: string | SystemMessage | SystemMessage[]): string => {
  if (typeof systemPrompt === 'string') {
    return systemPrompt;
  } else if (Array.isArray(systemPrompt)) {
    return systemPrompt.map(msg => msg.content).join('\n\n');
  } else {
    return systemPrompt.content;
  }
};

/**
 * 연락처 편집 화면 Props
 */
interface ContactEditScreenProps {}

/**
 * 연락처 편집 화면
 */
export const ContactEditScreen: React.FC<ContactEditScreenProps> = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'ContactEdit'>>();
  const { contactId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  
  // 연락처 정보 가져오기
  const contact = useAppSelector((state) =>
    state.contacts.contacts.find((c) => c.id === contactId)
  );
  
  // 편집 상태
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [temperature, setTemperature] = useState('0.7');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // 초기 데이터 설정
  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setDescription(contact.persona.description);
      setSystemPrompt(getSystemPromptContent(contact.persona.systemPrompt));
      setIsOnline(contact.isOnline);
      
      if (contact.persona.advancedSettings) {
        setTemperature(contact.persona.advancedSettings.temperature.toString());
        setShowAdvancedSettings(true);
      }
    }
  }, [contact]);
  
  // 헤더 설정
  useEffect(() => {
    navigation.setOptions({
      title: '연락처 편집',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          style={{ marginRight: 16 }}
        >
          <Text
            style={{
              color: isDarkMode ? Colors.accent : Colors.primary,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            저장
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode, name, description, systemPrompt, isOnline, temperature]);
  
  // 연락처가 없는 경우 처리
  if (!contact) {
    useEffect(() => {
      Alert.alert('오류', '연락처를 찾을 수 없습니다.');
      navigation.goBack();
    }, [navigation]);
    
    return null;
  }
  
  /**
   * 저장 처리
   */
  const handleSave = () => {
    // 입력 검증
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('오류', '설명을 입력해주세요.');
      return;
    }
    
    if (!systemPrompt.trim()) {
      Alert.alert('오류', '시스템 프롬프트를 입력해주세요.');
      return;
    }
    
    // 온도 값 검증
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue) || tempValue < 0 || tempValue > 1) {
      Alert.alert('오류', 'Temperature는 0에서 1 사이의 값이어야 합니다.');
      return;
    }
    
    // 연락처 업데이트
    // 유저 역할 프롬프트 맨 앞에 "당신은 [이름] 입니다." 추가
    const systemMessage: SystemMessage = {
      role: 'system',
      content: `당신은 ${name} 입니다. ${systemPrompt}`
    };
    
    const updatedContact = {
      contactId,
      name,
      persona: {
        description,
        systemPrompt: systemMessage,
        advancedSettings: showAdvancedSettings
          ? { temperature: tempValue }
          : undefined,
      },
    };
    
    dispatch(updateContact(updatedContact));
    
    // 온라인 상태 업데이트
    dispatch(setContactOnlineStatus({
      contactId,
      isOnline
    }));
    
    navigation.goBack();
  };
  
  return (
    <ScrollView
      style={[
        styles.container,
        isDarkMode && styles.containerDark,
      ]}
    >
      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        {/* 프로필 이미지 */}
        <View style={styles.avatarContainer}>
          {contact.avatar ? (
            <Image source={{ uri: contact.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primary }]}>
              <Text style={styles.avatarText}>
                {name.substring(0, 2)}
              </Text>
            </View>
          )}
          
          {/* 이미지 변경 버튼 (향후 구현) */}
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => Alert.alert('알림', '이미지 변경 기능은 아직 구현되지 않았습니다.')}
          >
            <Ionicons name="camera" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* 기본 정보 섹션 */}
      <View style={styles.formSection}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode && styles.textDark,
          ]}
        >
          기본 정보
        </Text>
        
        <View
          style={[
            styles.formCard,
            isDarkMode && styles.formCardDark,
          ]}
        >
          {/* 이름 입력 */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.inputLabel,
                isDarkMode && styles.textDark,
              ]}
            >
              이름
            </Text>
            <TextInput
              style={[
                styles.input,
                isDarkMode && styles.inputDark,
              ]}
              value={name}
              onChangeText={setName}
              placeholder="연락처 이름"
              placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
            />
          </View>
          
          {/* 온라인 상태 토글 */}
          <View style={styles.switchGroup}>
            <Text
              style={[
                styles.inputLabel,
                isDarkMode && styles.textDark,
              ]}
            >
              온라인 상태
            </Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#767577', true: Colors.primary }}
              thumbColor={isOnline ? Colors.accent : '#f4f3f4'}
            />
          </View>
          
          {/* 모델 정보 (읽기 전용) */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.inputLabel,
                isDarkMode && styles.textDark,
              ]}
            >
              AI 모델
            </Text>
            <Text
              style={[
                styles.modelInfo,
                isDarkMode && styles.textSecondaryDark,
              ]}
            >
              {Object.entries(REQUESTY_MODELS).find(([_, value]) => value === contact.modelId)?.[0] || contact.modelId}
            </Text>
          </View>
        </View>
      </View>
      
      {/* 페르소나 정보 섹션 */}
      <View style={styles.formSection}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode && styles.textDark,
          ]}
        >
          페르소나 정보
        </Text>
        
        <View
          style={[
            styles.formCard,
            isDarkMode && styles.formCardDark,
          ]}
        >
          {/* 설명 입력 */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.inputLabel,
                isDarkMode && styles.textDark,
              ]}
            >
              설명
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                isDarkMode && styles.inputDark,
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="AI 페르소나에 대한 설명"
              placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          {/* 시스템 프롬프트 입력 */}
          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.inputLabel,
                isDarkMode && styles.textDark,
              ]}
            >
              시스템 프롬프트
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                isDarkMode && styles.inputDark,
              ]}
              value={systemPrompt}
              onChangeText={setSystemPrompt}
              placeholder="AI에게 전달할 시스템 프롬프트"
              placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
      
      {/* 고급 설정 섹션 */}
      <View style={styles.formSection}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              isDarkMode && styles.textDark,
            ]}
          >
            고급 설정
          </Text>
          <Switch
            value={showAdvancedSettings}
            onValueChange={setShowAdvancedSettings}
            trackColor={{ false: '#767577', true: Colors.primary }}
            thumbColor={showAdvancedSettings ? Colors.accent : '#f4f3f4'}
          />
        </View>
        
        {showAdvancedSettings && (
          <View
            style={[
              styles.formCard,
              isDarkMode && styles.formCardDark,
            ]}
          >
            {/* Temperature 입력 */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && styles.textDark,
                ]}
              >
                Temperature (0-1)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  isDarkMode && styles.inputDark,
                ]}
                value={temperature}
                onChangeText={setTemperature}
                placeholder="0.7"
                placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
                keyboardType="numeric"
              />
              <Text
                style={[
                  styles.inputHint,
                  isDarkMode && styles.textSecondaryDark,
                ]}
              >
                낮은 값: 일관된 응답, 높은 값: 창의적인 응답
              </Text>
            </View>
          </View>
        )}
      </View>
      
      {/* 저장 버튼 */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightTheme.background,
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.background,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.lightTheme.background,
  },
  formSection: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  formCard: {
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formCardDark: {
    backgroundColor: Colors.darkTheme.card,
  },
  inputGroup: {
    marginBottom: 16,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.lightTheme.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputDark: {
    backgroundColor: Colors.darkTheme.background,
    borderColor: Colors.darkTheme.border,
    color: Colors.darkTheme.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modelInfo: {
    fontSize: 16,
    color: Colors.textSecondary,
    padding: 12,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  saveButton: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
});

export default ContactEditScreen;