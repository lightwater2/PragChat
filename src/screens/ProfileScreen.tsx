import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../navigation/types';

/**
 * 프로필 화면 컴포넌트
 */
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // 헤더 설정
  React.useEffect(() => {
    navigation.setOptions({
      title: '내 프로필',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // 프로필 편집 기능 (향후 구현)
            alert('프로필 편집 기능은 아직 구현되지 않았습니다.');
          }}
          style={{ marginRight: 16 }}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color={isDarkMode ? Colors.textLight : Colors.textPrimary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode]);
  
  /**
   * 설정 항목 렌더링
   */
  const renderSettingItem = (
    icon: string,
    title: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.settingItem,
          isDarkMode ? styles.settingItemDark : {},
        ]}
        onPress={onPress}
      >
        <View style={styles.settingItemLeft}>
          <Ionicons
            name={icon as any}
            size={24}
            color={isDarkMode ? Colors.darkTheme.text : Colors.textPrimary}
            style={styles.settingItemIcon}
          />
          <Text
            style={[
              styles.settingItemTitle,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            {title}
          </Text>
        </View>
        <View style={styles.settingItemRight}>
          {rightElement || (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
            />
          )}
        </View>
      </TouchableOpacity>
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
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>나</Text>
          </View>
        </View>
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
            styles.profileInfo,
            isDarkMode ? styles.textSecondaryDark : {},
          ]}
        >
          PragChat 사용자
        </Text>
      </View>
      
      {/* 설정 섹션 */}
      <View style={styles.settingsSection}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.textDark : {},
          ]}
        >
          앱 설정
        </Text>
        
        {/* 다크 모드 설정 */}
        {renderSettingItem(
          'moon-outline',
          '다크 모드',
          () => toggleTheme(),
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: Colors.primary }}
            thumbColor={isDarkMode ? Colors.accent : '#f4f3f4'}
          />
        )}
        
        {/* 알림 설정 */}
        {renderSettingItem(
          'notifications-outline',
          '알림 설정',
          () => {
            // 알림 설정 화면으로 이동 (향후 구현)
            alert('알림 설정 화면은 아직 구현되지 않았습니다.');
          }
        )}
        
        {/* 채팅 설정 */}
        {renderSettingItem(
          'chatbubble-outline',
          '채팅 설정',
          () => {
            // 채팅 설정 화면으로 이동 (향후 구현)
            alert('채팅 설정 화면은 아직 구현되지 않았습니다.');
          }
        )}
        
        {/* 개인정보 설정 */}
        {renderSettingItem(
          'shield-outline',
          '개인정보 설정',
          () => {
            // 개인정보 설정 화면으로 이동 (향후 구현)
            alert('개인정보 설정 화면은 아직 구현되지 않았습니다.');
          }
        )}
      </View>
      
      {/* 정보 섹션 */}
      <View style={styles.settingsSection}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode ? styles.textDark : {},
          ]}
        >
          정보
        </Text>
        
        {/* 앱 정보 */}
        {renderSettingItem(
          'information-circle-outline',
          '앱 정보',
          () => {
            // 앱 정보 화면으로 이동 (향후 구현)
            alert('앱 정보 화면은 아직 구현되지 않았습니다.');
          }
        )}
        
        {/* 도움말 */}
        {renderSettingItem(
          'help-circle-outline',
          '도움말',
          () => {
            // 도움말 화면으로 이동 (향후 구현)
            alert('도움말 화면은 아직 구현되지 않았습니다.');
          }
        )}
        
        {/* 개발자 정보 */}
        {renderSettingItem(
          'code-slash-outline',
          '개발자 정보',
          () => {
            // 개발자 정보 화면으로 이동 (향후 구현)
            alert('개발자 정보 화면은 아직 구현되지 않았습니다.');
          }
        )}
      </View>
      
      {/* 버전 정보 */}
      <Text
        style={[
          styles.versionInfo,
          isDarkMode ? styles.textSecondaryDark : {},
        ]}
      >
        PragChat v1.0.0
      </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightTheme.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileInfo: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  settingsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightTheme.border,
  },
  settingItemDark: {
    borderBottomColor: Colors.darkTheme.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemIcon: {
    marginRight: 16,
  },
  settingItemTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textSecondary,
    marginVertical: 24,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
});

export default ProfileScreen;