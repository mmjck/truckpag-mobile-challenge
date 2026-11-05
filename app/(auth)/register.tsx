import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { FormInput } from "@/src/components/FormInput";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/hooks/useTheme";
import {
  AUTH_LIMITS,
  RegisterFormData,
  registerSchema,
} from "@/src/schemas/auth";
import { borderRadius, layout, spacing, typography } from "@/src/theme";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    Keyboard.dismiss();
    try {
      await signUp(data.email.trim(), data.password, data.name.trim());
      router.replace("/(tabs)");
    } catch (error: any) {
      let message = "Falha ao criar conta";
      if (error.code === "auth/email-already-in-use") {
        message = "Este e-mail já está em uso";
      } else if (error.code === "auth/invalid-email") {
        message = "E-mail inválido";
      } else if (error.code === "auth/weak-password") {
        message = "Senha muito fraca";
      }
      Alert.alert("Erro", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.content} onPress={Keyboard.dismiss}>
          <View style={styles.header}>
            <Ionicons name="person-add" size={64} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>
              Criar Conta
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Cadastre-se para começar
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              control={control}
              name="name"
              placeholder="Nome"
              icon="person-outline"
              autoComplete="name"
              maxLength={AUTH_LIMITS.name.max}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />

            <FormInput
              ref={emailRef}
              control={control}
              name="email"
              placeholder="E-mail"
              icon="mail-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              maxLength={AUTH_LIMITS.email.max}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />

            <FormInput
              ref={passwordRef}
              control={control}
              name="password"
              placeholder="Senha"
              icon="lock-closed-outline"
              isPassword
              autoComplete="new-password"
              maxLength={AUTH_LIMITS.password.max}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              blurOnSubmit={false}
            />

            <FormInput
              ref={confirmPasswordRef}
              control={control}
              name="confirmPassword"
              placeholder="Confirmar Senha"
              icon="lock-closed-outline"
              isPassword
              autoComplete="new-password"
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
                  Criar Conta
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing["4xl"],
  },
  header: {
    alignItems: "center",
    marginBottom: spacing["4xl"],
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.base,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.headline,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing["2xl"],
  },
  footerText: {
    ...typography.callout,
  },
  linkText: {
    ...typography.callout,
    fontWeight: "600",
  },
});
