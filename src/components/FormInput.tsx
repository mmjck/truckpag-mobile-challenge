import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTheme } from '../hooks/useTheme';
import { spacing, borderRadius, typography, layout, palette } from '../theme';

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

function FormInputInner<T extends FieldValues>(
  {
    control,
    name,
    label,
    icon,
    isPassword = false,
    ...textInputProps
  }: FormInputProps<T>,
  ref: React.ForwardedRef<TextInput>
) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          {label && (
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {label}
            </Text>
          )}
          <View
            style={[
              styles.container,
              { backgroundColor: colors.inputBackground },
              error && { borderWidth: 1, borderColor: palette.red },
            ]}
          >
            {icon && (
              <Ionicons
                name={icon}
                size={layout.iconMd}
                color={error ? palette.red : colors.icon}
                style={styles.icon}
              />
            )}
            <TextInput
              ref={ref}
              style={[styles.input, { color: colors.text }]}
              placeholderTextColor={colors.inputPlaceholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={isPassword && !showPassword}
              {...textInputProps}
            />
            {isPassword && (
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={layout.iconMd}
                  color={colors.icon}
                />
              </Pressable>
            )}
          </View>
          {error && (
            <Text style={styles.errorText}>{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

export const FormInput = forwardRef(FormInputInner) as <T extends FieldValues>(
  props: FormInputProps<T> & { ref?: React.ForwardedRef<TextInput> }
) => React.ReactElement;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.footnote,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    height: layout.inputHeight,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    height: '100%',
  },
  eyeButton: {
    padding: spacing.xs,
  },
  errorText: {
    ...typography.caption1,
    color: palette.red,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
