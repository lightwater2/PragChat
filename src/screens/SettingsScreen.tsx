import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setTheme, setLanguage, updateNotificationSettings, updateChatSettings } from '../state/slices/settingsSlice';
import { toggleTheme } from '../state/slices/uiSlice';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { MainStackParamList } from '../navigation/types';
import { ThemeType, LanguageType } from '../types/settings';

/**
 * 설정 화면 컴포넌트
 */
export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  
  // 상태 가져오기
  const { settings } = useAppSelector((state) => state.settings);
  
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
   * 설정 항목 렌더링
   */
  const renderSettingItem = (
    icon: string,
    title: string,
    value: string | boolean | number | undefined,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.settingItem,
          isDarkMode ? styles.settingItemDark : {},
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.settingIconContainer}>
          <Ionicons
            name={icon as any}
            size={24}
            color={isDarkMode ? Colors.darkTheme.text : Colors.textPrimary}
          />
        </View>
        <View style={styles.settingContent}>
          <Text
            style={[
              styles.settingTitle,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            {title}
          </Text>
          {typeof value === 'string' && (
            <Text
              style={[
                styles.settingValue,
                isDarkMode ? styles.textSecondaryDark : {},
              ]}
            >
              {value}
            </Text>
          )}
        </View>
        {rightComponent || (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
          />
        )}
      </TouchableOpacity>
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
  
  return (
    <ScrollView
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
      ]}
    >
      {/* 프로필 섹션 */}
      <View
        style={[
          styles.profileSection,
          isDarkMode ? styles.profileSectionDark : {},
        ]}
      >
        <View style={styles.profileInfo}>
          <Text
            style={[
              styles.profileName,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            사용자
          </Text>
          <Text
            style={[
              styles.profileEmail,
              isDarkMode ? styles.textSecondaryDark : {},
            ]}
          >
            user@example.com
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('SettingsDetail', { screen: '프로필 편집' })}
        >
          <Text style={styles.editProfileButtonText}>편집</Text>
        </TouchableOpacity>
      </View>
      
      {/* 앱 설정 섹션 */}
      {renderSettingSection('앱 설정', (
        <>
          {renderSettingItem(
            'color-palette-outline',
            '테마',
            settings.theme === 'light' ? '라이트 모드' : 
              settings.theme === 'dark' ? '다크 모드' : '시스템 설정',
            () => navigation.navigate('SettingsDetail', { screen: '테마 설정' })
          )}
          {renderSettingItem(
            'language-outline',
            '언어',
            settings.language === 'ko' ? '한국어' : 'English',
            () => navigation.navigate('SettingsDetail', { screen: '언어 설정' })
          )}
          {renderSettingItem(
            'notifications-outline',
            '알림',
            settings.notifications.enabled ? '켜짐' : '꺼짐',
            () => navigation.navigate('SettingsDetail', { screen: '알림 설정' })
          )}
          {renderSettingItem(
            'chatbubble-ellipses-outline',
            '채팅 설정',
            `글꼴 크기: ${settings.chat.fontSize}px`,
            () => navigation.navigate('SettingsDetail', { screen: '채팅 설정' })
          )}
        </>
      ))}
      
      {/* 데이터 및 저장소 섹션 */}
      {renderSettingSection('데이터 및 저장소', (
        <>
          {renderSettingItem(
            'cloud-download-outline',
            '데이터 사용량',
            settings.dataUsage.autoDownload ? '자동 다운로드 켜짐' : '자동 다운로드 꺼짐',
            () => navigation.navigate('SettingsDetail', { screen: '데이터 사용량' })
          )}
          {renderSettingItem(
            'trash-outline',
            '캐시 삭제',
            '마지막 삭제: 없음',
            () => {
              // 캐시 삭제 로직 구현
              alert('캐시가 삭제되었습니다.');
            }
          )}
        </>
      ))}
      
      {/* 정보 섹션 */}
      {renderSettingSection('정보', (
        <>
          {renderSettingItem(
            'information-circle-outline',
            '앱 버전',
            '1.0.0',
            undefined
          )}
          {renderSettingItem(
            'code-outline',
            '개발자 정보',
            '',
            () => navigation.navigate('SettingsDetail', { screen: '개발자 정보' })
          )}
          {renderSettingItem(
            'help-circle-outline',
            '도움말 및 지원',
            '',
            () => navigation.navigate('SettingsDetail', { screen: '도움말 및 지원' })
          )}
        </>
      ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.lightTheme.card,
    marginBottom: 16,
  },
  profileSectionDark: {
    backgroundColor: Colors.darkTheme.card,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginLeft: 16,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightTheme.border,
  },
  settingItemDark: {
    borderBottomColor: Colors.darkTheme.border,
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
});