import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface SwipeAction {
  text: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface SwipeableItemProps {
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onPress?: () => void;
  children: React.ReactNode;
}

/**
 * 스와이프 가능한 아이템 컴포넌트
 * 좌우 스와이프 액션을 지원하는 리스트 아이템을 구현
 */
export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  leftActions = [],
  rightActions = [],
  onPress,
  children,
}) => {
  // @ts-ignore - SwipeRow 타입 관련 이슈
  const rowRef = useRef(null);
  // 스와이프 방향에 따른 투명도 관리를 위한 상태
  const [rowTranslate, setRowTranslate] = React.useState(0);

  // 스와이프 후 액션 버튼 렌더링
  const renderHiddenItem = () => {
    // 점진적 투명도 계산 (스와이프 정도에 따라 0~1 사이 값)
    // rowTranslate는 -1(좌측으로 완전히 스와이프) ~ 1(우측으로 완전히 스와이프) 사이 값
    
    // 좌측 버튼 투명도: 우측으로 스와이프할수록 불투명해짐
    const leftOpacity = Math.min(1, Math.max(0, 1 + rowTranslate));
    
    // 우측 버튼 투명도: 좌측으로 스와이프할수록 불투명해짐
    const rightOpacity = Math.min(1, Math.max(0, 1 - rowTranslate));
    
    return (
      <View style={styles.rowBack}>
        {/* 왼쪽 액션 버튼 */}
        <View style={[styles.leftActionsContainer, { opacity: leftOpacity }]}>
          {leftActions.map((action, index) => (
            <TouchableOpacity
              key={`left-${index}`}
              style={[
                styles.actionButton,
                { backgroundColor: action.color },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // @ts-ignore
                rowRef.current?.closeRow();
                action.onPress();
              }}
            >
              <Ionicons name={action.icon as any} size={24} color="#fff" />
              <Text style={styles.actionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* 오른쪽 액션 버튼 */}
        <View style={[styles.rightActionsContainer, { opacity: rightOpacity }]}>
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={`right-${index}`}
              style={[
                styles.actionButton,
                { backgroundColor: action.color },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // @ts-ignore
                rowRef.current?.closeRow();
                action.onPress();
              }}
            >
              <Ionicons name={action.icon as any} size={24} color="#fff" />
              <Text style={styles.actionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    // @ts-ignore - SwipeRow 타입 관련 이슈
    <SwipeRow
      ref={rowRef}
      leftOpenValue={leftActions.length * 80} // 왼쪽 액션 버튼 너비
      rightOpenValue={-rightActions.length * 80} // 오른쪽 액션 버튼 너비
      disableLeftSwipe={rightActions.length === 0}
      disableRightSwipe={leftActions.length === 0}
      friction={35} // 저항감 증가
      tension={55} // 스프링 효과 증가
      swipeToOpenPercent={50} // 스와이프 열림 임계값을 더 높게 설정
      swipeToClosePercent={35} // 스와이프 닫힘 임계값
      onRowOpen={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      stopLeftSwipe={leftActions.length * 100}
      stopRightSwipe={-rightActions.length * 100}
      // 스와이프 방향에 따른 투명도 제어
      onRowDidOpen={(direction: any) => {
        // 방향에 따라 상태 업데이트 (direction이 문자열 또는 숫자일 수 있음)
        if (typeof direction === 'string') {
          setRowTranslate(direction === 'left' ? -1 : 1);
        } else {
          // 숫자인 경우 양수면 우측, 음수면 좌측으로 판단
          setRowTranslate(direction < 0 ? -1 : 1);
        }
      }}
      onRowClose={() => {
        // 닫히면 상태 초기화
        setRowTranslate(0);
      }}
      // 스와이프 진행 상태 추적
      swipeGestureBegan={() => {
        // 스와이프 시작할 때 햅틱 피드백
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onSwipeValueChange={(data) => {
        // 스와이프 값에 따라 상태 업데이트 (-1.0 ~ 1.0 사이 값으로 정규화)
        if (data.value !== 0) {
          // 스와이프 최대 거리를 기준으로 정규화된 값 계산
          // 이 값이 클수록 스와이프가 더 많이 진행된 것
          const maxSwipeDistance = data.value > 0
            ? leftActions.length * 80
            : rightActions.length * 80;
          
          // 실제 스와이프 정도를 -1 ~ 1 사이 값으로 정규화
          const normalizedValue = maxSwipeDistance === 0
            ? 0
            : Math.max(-1, Math.min(1, data.value / maxSwipeDistance));
          
          setRowTranslate(normalizedValue);
        } else {
          // 스와이프가 없을 때는 0으로 초기화
          setRowTranslate(0);
        }
      }}
    >
      {renderHiddenItem()}
      <TouchableOpacity
        activeOpacity={0.95} // 터치 시 투명도를 거의 변화 없게 설정
        onPress={() => {
          if (onPress) {
            // @ts-ignore
            rowRef.current?.closeRow();
            onPress();
          }
        }}
        style={styles.rowFront}
      >
        {children}
      </TouchableOpacity>
    </SwipeRow>
  );
};

const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: 'white',
  },
  rowBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 80,
    height: 74, // ContactItem의 총 높이(패딩 포함 74px)에 맞춤
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});