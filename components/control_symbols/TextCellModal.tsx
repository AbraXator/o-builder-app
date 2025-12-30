import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TextCellModalProps = {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  showModal: boolean;
};

export default function ConfirmationModal({
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  showModal = true,
}: TextCellModalProps) {
  return (
    <View>
    <Modal
      transparent
      animationType="fade"
      visible={showModal}
      onRequestClose={onCancel}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.backdrop}>
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>{"Cancel"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                <Text style={styles.confirmText}>{"Confirm"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
  },
  cancelText: {
    color: '#111',
    fontSize: 14,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
  },
});
