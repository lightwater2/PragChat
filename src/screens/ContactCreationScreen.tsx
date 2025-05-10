import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { createContact } from '../state/slices/contactsSlice';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { MainStackParamList } from '../navigation/types';
import { Persona, DEFAULT_PERSONAS, SystemMessage } from '../types/contact';
import { FEATURED_MODELS } from '../constants/llmModels';

/**
 * 연락처 생성 화면 컴포넌트
 */
export const ContactCreationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  
  // 상태 가져오기
  const { selectedModelId: globalSelectedModelId } = useAppSelector((state) => state.chat);
  
  // 폼 상태
  const [name, setName] = useState('');
  const [selectedModelId, setSelectedModelId] = useState(globalSelectedModelId);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | undefined>(undefined);
  const [customDescription, setCustomDescription] = useState('');
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  
  /**
   * 연락처 생성 처리
   */
  const handleCreateContact = () => {
    // 유효성 검사
    if (!name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return;
    }
    
    let persona: Persona;
    
    if (selectedPersonaId) {
      // 기본 페르소나 사용
      const selectedPersona = DEFAULT_PERSONAS.find(p => p.id === selectedPersonaId);
      if (!selectedPersona) {
        Alert.alert('오류', '페르소나를 선택해주세요.');
        return;
      }
      
      // 기본 페르소나에서도 "당신은 [이름] 입니다." 추가
      const originalSystemPrompt = selectedPersona.systemPrompt as SystemMessage;
      const modifiedSystemPrompt: SystemMessage = {
        role: originalSystemPrompt.role,
        content: `당신은 ${name} 입니다. ${originalSystemPrompt.content}`
      };
      
      persona = {
        description: selectedPersona.description,
        systemPrompt: modifiedSystemPrompt,
        advancedSettings: isAdvancedMode ? { temperature } : undefined
      };
    } else {
      // 커스텀 페르소나 사용
      if (!customDescription.trim()) {
        Alert.alert('오류', '페르소나 설명을 입력해주세요.');
        return;
      }
      
      if (!customSystemPrompt.trim()) {
        Alert.alert('오류', '시스템 프롬프트를 입력해주세요.');
        return;
      }
      
      // 시스템 프롬프트를 SystemMessage 형식으로 변환
      // 유저 역할 프롬프트 맨 앞에 "당신은 [이름] 입니다." 추가
      const systemMessage: SystemMessage = {
        role: 'system',
        content: `당신은 ${name} 입니다. ${customSystemPrompt}`
      };
      
      persona = {
        description: customDescription,
        systemPrompt: systemMessage,
        advancedSettings: isAdvancedMode ? { temperature } : undefined
      };
    }
    
    // 연락처 생성 액션 디스패치
    dispatch(createContact({
      name,
      modelId: selectedModelId,
      avatar,
      backgroundImage,
      persona
    }));
    
    // 연락처 목록 화면으로 이동
    navigation.goBack();
  };
  
  /**
   * 페르소나 항목 렌더링
   */
  const renderPersonaItem = (persona: typeof DEFAULT_PERSONAS[0]) => {
    const isSelected = selectedPersonaId === persona.id;
    
    return (
      <TouchableOpacity
        key={persona.id}
        style={[
          styles.personaItem,
          isDarkMode ? styles.personaItemDark : {},
          isSelected ? styles.personaItemSelected : {}
        ]}
        onPress={() => {
          setSelectedPersonaId(persona.id);
          setCustomDescription('');
          setCustomSystemPrompt('');
        }}
      >
        <View style={styles.personaHeader}>
          <Text
            style={[
              styles.personaName,
              isDarkMode ? styles.textDark : {},
              isSelected ? styles.textSelected : {}
            ]}
          >
            {persona.name}
          </Text>
          {isSelected && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.primary}
            />
          )}
        </View>
        <Text
          style={[
            styles.personaDescription,
            isDarkMode ? styles.textSecondaryDark : {},
            isSelected ? styles.textSecondarySelected : {}
          ]}
        >
          {persona.description}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 기본 정보 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.textDark : {},
          ]}
        >
          기본 정보
        </Text>
        
        <View
          style={[
            styles.formGroup,
            isDarkMode ? styles.formGroupDark : {},
          ]}
        >
          <Text
            style={[
              styles.label,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            이름
          </Text>
          <TextInput
            style={[
              styles.input,
              isDarkMode ? styles.inputDark : {},
            ]}
            value={name}
            onChangeText={setName}
            placeholder="연락처 이름 입력"
            placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
          />
        </View>
        
        <View
          style={[
            styles.formGroup,
            isDarkMode ? styles.formGroupDark : {},
          ]}
        >
          <Text
            style={[
              styles.label,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            프로필 이미지
          </Text>
          <TouchableOpacity
            style={[
              styles.imagePickerButton,
              isDarkMode ? styles.imagePickerButtonDark : {},
            ]}
            onPress={() => {
              // 이미지 선택 로직 구현 (향후 구현)
              Alert.alert('알림', '이미지 선택 기능은 아직 구현되지 않았습니다.');
            }}
          >
            <Ionicons
              name="image-outline"
              size={24}
              color={isDarkMode ? Colors.darkTheme.text : Colors.textPrimary}
            />
            <Text
              style={[
                styles.imagePickerText,
                isDarkMode ? styles.textDark : {},
              ]}
            >
              이미지 선택
            </Text>
          </TouchableOpacity>
        </View>
        
        <View
          style={[
            styles.formGroup,
            isDarkMode ? styles.formGroupDark : {},
          ]}
        >
          <Text
            style={[
              styles.label,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            배경 이미지
          </Text>
          <TouchableOpacity
            style={[
              styles.imagePickerButton,
              isDarkMode ? styles.imagePickerButtonDark : {},
            ]}
            onPress={() => {
              // 이미지 선택 로직 구현 (향후 구현)
              Alert.alert('알림', '이미지 선택 기능은 아직 구현되지 않았습니다.');
            }}
          >
            <Ionicons
              name="image-outline"
              size={24}
              color={isDarkMode ? Colors.darkTheme.text : Colors.textPrimary}
            />
            <Text
              style={[
                styles.imagePickerText,
                isDarkMode ? styles.textDark : {},
              ]}
            >
              배경 이미지 선택
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* 모델 선택 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.textDark : {},
          ]}
        >
          모델 선택
        </Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modelList}
        >
          {FEATURED_MODELS.map((model) => {
            const isSelected = selectedModelId === model.id;
            
            return (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelItem,
                  isDarkMode ? styles.modelItemDark : {},
                  isSelected ? styles.modelItemSelected : {}
                ]}
                onPress={() => setSelectedModelId(model.id)}
              >
                <View style={styles.modelHeader}>
                  <Text
                    style={[
                      styles.modelProvider,
                      isDarkMode ? styles.textSecondaryDark : {},
                    ]}
                  >
                    {model.provider}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={Colors.primary}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.modelName,
                    isDarkMode ? styles.textDark : {},
                    isSelected ? styles.textSelected : {}
                  ]}
                >
                  {model.name}
                </Text>
                <Text
                  style={[
                    styles.modelDescription,
                    isDarkMode ? styles.textSecondaryDark : {},
                  ]}
                  numberOfLines={2}
                >
                  {model.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {/* 페르소나 섹션 */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.textDark : {},
          ]}
        >
          페르소나 선택
        </Text>
        
        <View style={styles.personaList}>
          {DEFAULT_PERSONAS.map(renderPersonaItem)}
          
          <TouchableOpacity
            style={[
              styles.personaItem,
              isDarkMode ? styles.personaItemDark : {},
              !selectedPersonaId ? styles.personaItemSelected : {}
            ]}
            onPress={() => {
              setSelectedPersonaId(undefined);
            }}
          >
            <View style={styles.personaHeader}>
              <Text
                style={[
                  styles.personaName,
                  isDarkMode ? styles.textDark : {},
                  !selectedPersonaId ? styles.textSelected : {}
                ]}
              >
                커스텀 페르소나
              </Text>
              {!selectedPersonaId && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.primary}
                />
              )}
            </View>
            <Text
              style={[
                styles.personaDescription,
                isDarkMode ? styles.textSecondaryDark : {},
                !selectedPersonaId ? styles.textSecondarySelected : {}
              ]}
            >
              직접 페르소나를 정의합니다.
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* 커스텀 페르소나 설정 */}
        {!selectedPersonaId && (
          <View
            style={[
              styles.customPersonaSection,
              isDarkMode ? styles.customPersonaSectionDark : {},
            ]}
          >
            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.label,
                  isDarkMode ? styles.textDark : {},
                ]}
              >
                페르소나 설명
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  isDarkMode ? styles.inputDark : {},
                ]}
                value={customDescription}
                onChangeText={setCustomDescription}
                placeholder="페르소나에 대한 간단한 설명"
                placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.label,
                  isDarkMode ? styles.textDark : {},
                ]}
              >
                시스템 프롬프트
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  isDarkMode ? styles.inputDark : {},
                ]}
                value={customSystemPrompt}
                onChangeText={setCustomSystemPrompt}
                placeholder="AI에게 전달할 시스템 프롬프트"
                placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
                multiline
                numberOfLines={5}
              />
            </View>
          </View>
        )}
      </View>
      
      {/* 고급 설정 섹션 */}
      <View style={styles.section}>
        <View style={styles.advancedHeader}>
          <Text
            style={[
              styles.sectionTitle,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            고급 설정
          </Text>
          <Switch
            value={isAdvancedMode}
            onValueChange={setIsAdvancedMode}
            trackColor={{ false: '#767577', true: Colors.primary }}
            thumbColor="#f4f3f4"
          />
        </View>
        
        {isAdvancedMode && (
          <View
            style={[
              styles.advancedSettings,
              isDarkMode ? styles.advancedSettingsDark : {},
            ]}
          >
            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.label,
                  isDarkMode ? styles.textDark : {},
                ]}
              >
                Temperature: {temperature.toFixed(1)}
              </Text>
              <View style={styles.sliderContainer}>
                <Text
                  style={[
                    styles.sliderLabel,
                    isDarkMode ? styles.textSecondaryDark : {},
                  ]}
                >
                  0.0
                </Text>
                <View style={styles.slider}>
                  {/* 슬라이더 구현 (간단한 버전) */}
                  <TouchableOpacity
                    style={[
                      styles.sliderTrack,
                      { width: `${temperature * 100}%` },
                    ]}
                    onPress={(e) => {
                      // 터치 위치에 따라 온도 설정
                      const newTemp = Math.min(Math.max(0, temperature + 0.1), 1);
                      setTemperature(newTemp);
                    }}
                  >
                    <View style={styles.sliderThumb} />
                  </TouchableOpacity>
                  <View style={styles.sliderBackground} />
                </View>
                <Text
                  style={[
                    styles.sliderLabel,
                    isDarkMode ? styles.textSecondaryDark : {},
                  ]}
                >
                  1.0
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      
      {/* 버튼 섹션 */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.cancelButton,
            isDarkMode ? styles.cancelButtonDark : {},
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.buttonText,
              styles.cancelButtonText,
              isDarkMode ? styles.cancelButtonTextDark : {},
            ]}
          >
            취소
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button,
            styles.createButton,
          ]}
          onPress={handleCreateContact}
        >
          <Text style={styles.buttonText}>
            생성
          </Text>
        </TouchableOpacity>
      </View>
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
  contentContainer: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.textPrimary,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupDark: {
    borderColor: Colors.darkTheme.border,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
  },
  inputDark: {
    backgroundColor: Colors.darkTheme.card,
    borderColor: Colors.darkTheme.border,
    color: Colors.darkTheme.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
    borderStyle: 'dashed',
  },
  imagePickerButtonDark: {
    backgroundColor: Colors.darkTheme.card,
    borderColor: Colors.darkTheme.border,
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modelList: {
    paddingBottom: 8,
  },
  modelItem: {
    width: 160,
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
  },
  modelItemDark: {
    backgroundColor: Colors.darkTheme.card,
    borderColor: Colors.darkTheme.border,
  },
  modelItemSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modelProvider: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  modelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  modelDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  personaList: {
    marginBottom: 16,
  },
  personaItem: {
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
  },
  personaItemDark: {
    backgroundColor: Colors.darkTheme.card,
    borderColor: Colors.darkTheme.border,
  },
  personaItemSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  personaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  personaDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  customPersonaSection: {
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  customPersonaSectionDark: {
    backgroundColor: Colors.darkTheme.card,
  },
  advancedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  advancedSettings: {
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
  },
  advancedSettingsDark: {
    backgroundColor: Colors.darkTheme.card,
    borderColor: Colors.darkTheme.border,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 30,
  },
  slider: {
    flex: 1,
    height: 20,
    position: 'relative',
    marginHorizontal: 8,
  },
  sliderBackground: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.lightTheme.border,
    borderRadius: 2,
  },
  sliderTrack: {
    position: 'absolute',
    top: 8,
    left: 0,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    zIndex: 1,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    right: -10,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.textLight,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.textSecondary,
  },
  cancelButtonDark: {
    borderColor: Colors.darkTheme.textSecondary,
  },
  createButton: {
    marginLeft: 8,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
  },
  cancelButtonTextDark: {
    color: Colors.darkTheme.textSecondary,
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
  textSecondarySelected: {
    color: Colors.textPrimary,
  },
});

export default ContactCreationScreen;