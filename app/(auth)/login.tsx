import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/hooks/useTheme';
import { spacing, borderRadius, typography, layout } from '@/src/theme';
import { loginSchema, LoginFormData, AUTH_LIMITS } from '@/src/schemas/auth';
import { FormInput } from '@/src/components/FormInput';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    try {
      await signIn(data.email.trim(), data.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      let message = 'Falha ao entrar';
      if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido';
      } else if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'E-mail ou senha inválidos';
      }
      Alert.alert('Erro', message);
    }
  };

  const focusPassword = () => {
    passwordRef.current?.focus();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="book" size={64} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>
              Dictionary App
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Entre para salvar seus favoritos
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              control={control}
              name="email"
              placeholder="E-mail"
              icon="mail-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              maxLength={AUTH_LIMITS.email.max}
              returnKeyType="next"
              onSubmitEditing={focusPassword}
              blurOnSubmit={false}
            />

            <FormInput
              ref={passwordRef}
              control={control}
              name="password"
              placeholder="Senha"
              icon="lock-closed-outline"
              isPassword
              autoComplete="password"
              maxLength={AUTH_LIMITS.password.max}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />

            <Pressable
              style={[
                styles.button,
                { backgroundColor: colors.buttonBackground },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                  Entrar
                </Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Não tem uma conta?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable>
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  Cadastre-se
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  title: {
    ...typography.title1,
    marginTop: spacing.base,
  },
  subtitle: {
    ...typography.callout,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.xs,
  },
  button: {
    height: layout.buttonHeight,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.base,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.headline,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
  },
  footerText: {
    ...typography.callout,
  },
  linkText: {
    ...typography.callout,
    fontWeight: '600',
  },
});
