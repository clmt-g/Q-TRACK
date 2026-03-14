import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors } from '@/styles/theme';

interface PasswordRule {
    label: string;
    test: (password: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
    { label: '12 caractères minimum', test: (p) => p.length >= 12 },
    { label: 'Une majuscule', test: (p) => /[A-Z]/.test(p) },
    { label: 'Une minuscule', test: (p) => /[a-z]/.test(p) },
    { label: 'Un chiffre', test: (p) => /[0-9]/.test(p) },
    { label: 'Un caractère spécial', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

export function getPasswordStrength(password: string): number {
    return PASSWORD_RULES.filter((r) => r.test(password)).length;
}

export function isPasswordValid(password: string): boolean {
    return getPasswordStrength(password) === PASSWORD_RULES.length;
}

interface PasswordInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    showStrengthIndicator?: boolean;
    required?: boolean;
}

export default function PasswordInput({
                                          label,
                                          value,
                                          onChangeText,
                                          placeholder = '••••••••',
                                          showStrengthIndicator = false,
                                          required = false,
                                      }: PasswordInputProps) {
    const [show, setShow] = useState(false);

    const strength = getPasswordStrength(value);
    const strengthColors = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#10b981'];
    const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort'];

    return (
        <View style={styles.wrapper}>
            <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>
                        {label}{required ? ' *' : ''}
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, styles.passwordInput]}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            placeholderTextColor={colors.textMuted}
                            secureTextEntry={!show}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity onPress={() => setShow(!show)} style={styles.eyeIcon}>
                            <Ionicons
                                name={show ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color={colors.textMuted}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {showStrengthIndicator && value.length > 0 && (
                <View style={styles.strengthContainer}>
                    {/* Barre de progression */}
                    <View style={styles.strengthBarRow}>
                        {PASSWORD_RULES.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.strengthSegment,
                                    { backgroundColor: i < strength ? strengthColors[strength - 1] : colors.border },
                                ]}
                            />
                        ))}
                        <Text style={[styles.strengthLabel, { color: strengthColors[strength - 1] ?? colors.textMuted }]}>
                            {value.length > 0 ? strengthLabels[strength - 1] ?? 'Très faible' : ''}
                        </Text>
                    </View>

                    {/* Règles détaillées */}
                    <View style={styles.rulesContainer}>
                        {PASSWORD_RULES.map((rule) => {
                            const passed = rule.test(value);
                            return (
                                <View key={rule.label} style={styles.ruleRow}>
                                    <Ionicons
                                        name={passed ? 'checkmark-circle' : 'ellipse-outline'}
                                        size={14}
                                        color={passed ? '#10b981' : colors.textMuted}
                                    />
                                    <Text style={[styles.ruleText, { color: passed ? '#10b981' : colors.textMuted }]}>
                                        {rule.label}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    inputWrapper: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        padding: 0,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    eyeIcon: {
        padding: 4,
    },
    strengthContainer: {
        marginTop: 8,
        paddingHorizontal: 4,
    },
    strengthBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    strengthSegment: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    strengthLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
        minWidth: 60,
        textAlign: 'right',
    },
    rulesContainer: {
        gap: 4,
    },
    ruleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ruleText: {
        fontSize: 12,
    },
});
