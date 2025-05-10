import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  setTheme,
  setLanguage,
  updateNotificationSettings,
  updateChatSettings,
  updateDataUsageSettings,
} from '../state/slices/settingsSlice';
import { toggleTheme } from '../state/slices/uiSlice';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { MainStackParamList } from '../navigation/types';
import { ThemeType, LanguageType } from '../types/settings';
import { BACKGROUND_LIST } from '../constants/backgrounds';

/**
 * 설정 상세 화면 컴포넌트
 */
export const SettingsDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'SettingsDetail'>>();
  const { screen } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  
  // 상태 가져오기
  const { settings } = useAppSelector((state) => state.settings);
  
  // 헤더 설정
  React.useEffect(() => {
    navigation.setOptions({
      title: screen,
    });
  }, [navigation, screen]);
  
  /**
   * 테마 변경 처리
   */
  const handleThemeChange = (theme: ThemeType) => {
    dispatch(setTheme(theme));
    
    // 'system'이 아닌 경우 UI 테마도 직접 변경
    if (theme !== 'system') {
      const shouldBeDark = theme === 'dark';
      if (isDarkMode !== shouldBeDark) {
        dispatch(toggleTheme());
      }
    }
  };
  
  /**
   * 언어 변경 처리
   */
  const handleLanguageChange = (language: LanguageType) => {
    dispatch(setLanguage(language));
  };
  
  /**
   * 알림 설정 변경 처리
   */
  const handleNotificationToggle = (key: keyof typeof settings.notifications, value: boolean) => {
    dispatch(updateNotificationSettings({ [key]: value }));
  };
  
  /**
   * 채팅 설정 변경 처리
   */
  const handleChatSettingChange = (key: keyof typeof settings.chat, value: any) => {
    dispatch(updateChatSettings({ [key]: value }));
  };
  
  /**
   * 데이터 사용량 설정 변경 처리
   */
  const handleDataUsageToggle = (key: keyof typeof settings.dataUsage, value: boolean) => {
    dispatch(updateDataUsageSettings({ [key]: value }));
  };
  
  /**
   * 설정 항목 렌더링 (스위치)
   */
  const renderSwitchItem = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => {
    return (
      <View
        style={[
          styles.settingItem,
          isDarkMode ? styles.settingItemDark : {},
        ]}
      >
        <View style={styles.settingContent}>
          <Text
            style={[
              styles.settingTitle,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.settingDescription,
              isDarkMode ? styles.textSecondaryDark : {},
            ]}
          >
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: Colors.primary }}
          thumbColor={value ? Colors.accent : '#f4f3f4'}
        />
      </View>
    );
  };
  
  /**
   * 설정 항목 렌더링 (라디오 버튼)
   */
  const renderRadioItem = (
    title: string,
    isSelected: boolean,
    onPress: () => void
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.settingItem,
          isDarkMode ? styles.settingItemDark : {},
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            styles.settingTitle,
            isDarkMode ? styles.textDark : {},
            isSelected ? styles.selectedText : {},
          ]}
        >
          {title}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={24}
            color={Colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  /**
   * 설정 항목 렌더링 (슬라이더)
   */
  const renderSliderItem = (
    title: string,
    value: number,
    minimumValue: number,
    maximumValue: number,
    step: number,
    onValueChange: (value: number) => void
  ) => {
    return (
      <View
        style={[
          styles.settingItem,
          isDarkMode ? styles.settingItemDark : {},
        ]}
      >
        <View style={styles.sliderHeader}>
          <Text
            style={[
              styles.settingTitle,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.sliderValue,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            {value}
          </Text>
        </View>
        <Slider
          style={styles.slider}
          value={value}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          onValueChange={onValueChange}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={isDarkMode ? Colors.darkTheme.border : Colors.lightTheme.border}
          thumbTintColor={Colors.accent}
        />
      </View>
    );
  };
  
  /**
   * 설정 섹션 렌더링
   */
  const renderSettingSection = (title: string, children: React.ReactNode) => {
    return (
      <View style={styles.settingSection}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.textSecondaryDark : {},
          ]}
        >
          {title}
        </Text>
        <View
          style={[
            styles.sectionContent,
            isDarkMode ? styles.sectionContentDark : {},
          ]}
        >
          {children}
        </View>
      </View>
    );
  };
  
  /**
   * 테마 설정 화면 렌더링
   */
  const renderThemeSettings = () => {
    return (
      <>
        {renderSettingSection('테마 선택', (
          <>
            {renderRadioItem(
              '라이트 모드',
              settings.theme === 'light',
              () => handleThemeChange('light')
            )}
            {renderRadioItem(
              '다크 모드',
              settings.theme === 'dark',
              () => handleThemeChange('dark')
            )}
            {renderRadioItem(
              '시스템 설정 사용',
              settings.theme === 'system',
              () => handleThemeChange('system')
            )}
          </>
        ))}
      </>
    );
  };
  
  /**
   * 언어 설정 화면 렌더링
   */
  const renderLanguageSettings = () => {
    return (
      <>
        {renderSettingSection('언어 선택', (
          <>
            {renderRadioItem(
              '한국어',
              settings.language === 'ko',
              () => handleLanguageChange('ko')
            )}
            {renderRadioItem(
              'English',
              settings.language === 'en',
              () => handleLanguageChange('en')
            )}
          </>
        ))}
      </>
    );
  };
  
  /**
   * 알림 설정 화면 렌더링
   */
  const renderNotificationSettings = () => {
    return (
      <>
        {renderSettingSection('알림 설정', (
          <>
            {renderSwitchItem(
              '알림 사용',
              '새 메시지 및 활동에 대한 알림을 받습니다.',
              settings.notifications.enabled,
              (value) => handleNotificationToggle('enabled', value)
            )}
            {renderSwitchItem(
              '소리',
              '알림 시 소리를 재생합니다.',
              settings.notifications.sound,
              (value) => handleNotificationToggle('sound', value)
            )}
            {renderSwitchItem(
              '진동',
              '알림 시 진동을 사용합니다.',
              settings.notifications.vibration,
              (value) => handleNotificationToggle('vibration', value)
            )}
          </>
        ))}
      </>
    );
  };
  
  /**
   * 채팅 설정 화면 렌더링
   */
  const renderChatSettings = () => {
    return (
      <>
        {renderSettingSection('채팅 설정', (
          <>
            {renderSliderItem(
              '글꼴 크기',
              settings.chat.fontSize,
              12,
              20,
              1,
              (value) => handleChatSettingChange('fontSize', value)
            )}
            {renderSwitchItem(
              '배경 색상 사용',
              '채팅방에 배경 색상을 사용합니다.',
              !!settings.chat.defaultBackground,
              (value) => handleChatSettingChange('defaultBackground', value ? 'default' : undefined)
            )}
          </>
        ))}
      </>
    );
  };
  
  /**
   * 채팅 배경 설정 화면 렌더링
   */
  const renderChatBackgroundSettings = () => {
    return (
      <>
        {renderSettingSection('배경 색상 선택', (
          <View style={styles.backgroundGrid}>
            {BACKGROUND_LIST.map((background) => (
              <TouchableOpacity
                key={background.id}
                style={[
                  styles.backgroundItem,
                  { backgroundColor: background.color },
                  settings.chat.defaultBackground === background.id ? styles.selectedBackground : {},
                ]}
                onPress={() => handleChatSettingChange('defaultBackground', background.id)}
              >
                {settings.chat.defaultBackground === background.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={background.isDark ? '#fff' : '#000'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        {renderSettingSection('배경 설정', (
          <>
            {renderSwitchItem(
              '배경 흐림 효과',
              '배경에 흐림 효과를 적용합니다.',
              !!settings.chat.backgroundBlur,
              (value) => handleChatSettingChange('backgroundBlur', value)
            )}
            {renderSliderItem(
              '배경 투명도',
              settings.chat.backgroundOpacity || 0.5,
              0,
              1,
              0.1,
              (value) => handleChatSettingChange('backgroundOpacity', value)
            )}
          </>
        ))}
      </>
    );
  };
  
  /**
   * 데이터 사용량 설정 화면 렌더링
   */
  const renderDataUsageSettings = () => {
    return (
      <>
        {renderSettingSection('데이터 사용량 설정', (
          <>
            {renderSwitchItem(
              '이미지 저장',
              '수신된 이미지를 기기에 저장합니다.',
              settings.dataUsage.saveImages,
              (value) => handleDataUsageToggle('saveImages', value)
            )}
            {renderSwitchItem(
              '자동 다운로드',
              '미디어 파일을 자동으로 다운로드합니다.',
              settings.dataUsage.autoDownload,
              (value) => handleDataUsageToggle('autoDownload', value)
            )}
          </>
        ))}
      </>
    );
  };
  
  /**
   * 개발자 정보 화면 렌더링
   */
  const renderDeveloperInfo = () => {
    return (
      <>
        {renderSettingSection('개발자 정보', (
          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.infoTitle,
                isDarkMode ? styles.textDark : {},
              ]}
            >
              PragChat
            </Text>
            <Text
              style={[
                styles.infoText,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              대화형 LLM을 모방하는 리액트 네이티브 앱
            </Text>
            <Text
              style={[
                styles.infoText,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              개발자: PragChat 팀
            </Text>
            <Text
              style={[
                styles.infoText,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              © 2025 PragChat. All rights reserved.
            </Text>
          </View>
        ))}
      </>
    );
  };
  
  /**
   * 도움말 및 지원 화면 렌더링
   */
  const renderHelpAndSupport = () => {
    return (
      <>
        {renderSettingSection('도움말 및 지원', (
          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.infoTitle,
                isDarkMode ? styles.textDark : {},
              ]}
            >
              도움이 필요하신가요?
            </Text>
            <Text
              style={[
                styles.infoText,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              PragChat 사용 중 문제가 발생하셨나요? 아래 연락처로 문의해주세요.
            </Text>
            <Text
              style={[
                styles.infoText,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              이메일: support@pragchat.com
            </Text>
            <Text
              style={[
                styles.infoText,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              웹사이트: www.pragchat.com
            </Text>
          </View>
        ))}
      </>
    );
  };
  
  /**
   * 프로필 편집 화면 렌더링
   */
  const renderProfileEdit = () => {
    return (
      <View style={styles.centeredContainer}>
        <Text
          style={[
            styles.infoTitle,
            isDarkMode ? styles.textDark : {},
          ]}
        >
          준비 중입니다
        </Text>
        <Text
          style={[
            styles.infoText,
            isDarkMode ? styles.textSecondaryDark : {},
          ]}
        >
          프로필 편집 기능은 아직 개발 중입니다.
        </Text>
      </View>
    );
  };
  
  // 화면 타입에 따라 다른 내용 렌더링
  const renderContent = () => {
    switch (screen) {
      case '테마 설정':
        return renderThemeSettings();
      case '언어 설정':
        return renderLanguageSettings();
      case '알림 설정':
        return renderNotificationSettings();
      case '채팅 설정':
        return renderChatSettings();
      case '채팅 배경':
        return renderChatBackgroundSettings();
      case '데이터 사용량':
        return renderDataUsageSettings();
      case '개발자 정보':
        return renderDeveloperInfo();
      case '도움말 및 지원':
        return renderHelpAndSupport();
      case '프로필 편집':
        return renderProfileEdit();
      default:
        return (
          <View style={styles.centeredContainer}>
            <Text
              style={[
                styles.infoTitle,
                isDarkMode ? styles.textDark : {},
              ]}
            >
              준비 중입니다
            </Text>
            <Text
              style={[
                styles.infoText,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              이 설정 화면은 아직 개발 중입니다.
            </Text>
          </View>
        );
    }
  };
  
  return (
    <ScrollView
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
      ]}
    >
      {renderContent()}
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
  settingSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionContentDark: {
    backgroundColor: Colors.darkTheme.card,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightTheme.border,
  },
  settingItemDark: {
    borderBottomColor: Colors.darkTheme.border,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  selectedText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  backgroundItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
  },
  selectedBackground: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});

export default SettingsDetailScreen;