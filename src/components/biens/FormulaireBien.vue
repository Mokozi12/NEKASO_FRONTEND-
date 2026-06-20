<template>
  <ModalBase :show="show" max-width="600px" :show-close="true" @close="$emit('cancel')">
    <div class="form-content">
      <h2 class="form-title">{{ isEdit ? 'Modifier le bien' : 'Nouveau bien immobilier' }}</h2>

      
      <div class="form-section">
        <label class="form-label">Photos du bien <span class="form-hint">(5 images maximum)</span></label>
        <div class="photos-container">
          
          <div v-for="(photo, index) in photos" :key="index" class="photo-item">
            <img :src="photo.url" :alt="'Photo ' + (index + 1)" />
            <span v-if="index === 0" class="photo-badge">Principale</span>
            <button class="photo-remove" @click="removePhoto(index)">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <button v-if="photos.length < MAX_PHOTOS" class="photo-add" @click="triggerFileInput">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              stroke-width="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
              <line x1="12" y1="9" x2="18" y2="9" stroke-width="2"></line>
              <line x1="15" y1="6" x2="15" y2="12" stroke-width="2"></line>
            </svg>
            <span>Ajouter</span>
          </button>
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            class="hidden-input"
            @change="handleFileSelect"
          />
        </div>
      </div>

      <div class="form-grid">
        
        <div class="form-group full-width">
          <label class="form-label">Nom du bien *</label>
          <input
            type="text"
            class="form-input"
            v-model="formData.libelle"
            placeholder="Ex: Appartement Almadies"
          />
        </div>

        
        <div class="form-group full-width">
          <label class="form-label">Adresse *</label>
          <input
            type="text"
            class="form-input"
            v-model="formData.adresse"
            placeholder="Ex: Rue 12, Almadies, Dakar"
          />
        </div>

        
        <template v-if="!isEdit">
          
          <div class="form-group">
            <label class="form-label">Type</label>
            <div class="select-wrapper">
              <select class="form-input select-input" v-model="formData.typeBien">
                <option value="APPARTEMENT">Appartement</option>
                <option value="STUDIO">Studio</option>
                <option value="CHAMBRE">Chambre</option>
                <option value="LOCAL">Local</option>
              </select>
              <svg
                class="select-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Surface (m²)</label>
            <input
              type="number"
              class="form-input"
              v-model="formData.surface"
              placeholder="Ex: 85"
            />
          </div>

          
          <div class="form-group">
            <label class="form-label">Pièces</label>
            <div class="number-input-wrapper">
              <input
                type="number"
                class="form-input"
                v-model.number="formData.nombrePieces"
                min="1"
              />
              <div class="number-controls">
                <button class="number-btn" type="button" @click="formData.nombrePieces++">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
                <button
                  class="number-btn"
                  type="button"
                  @click="formData.nombrePieces > 1 && formData.nombrePieces--"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Loyer (FCFA) *</label>
            <input
              type="number"
              class="form-input"
              v-model="formData.loyer"
              placeholder="Ex: 450000"
            />
          </div>
        </template>

        
        <template v-else>
          
          <div class="form-group">
            <label class="form-label">Loyer *</label>
            <input type="number" class="form-input" v-model="formData.loyer" />
          </div>
          <div class="form-group">
            <label class="form-label">Charges</label>
            <input type="number" class="form-input" v-model="formData.charges" />
          </div>
        </template>

        
        <div class="form-group full-width">
          <label class="form-label">Description</label>
          <textarea
            class="form-input textarea-input"
            rows="3"
            v-model="formData.description"
            placeholder="Décrivez le bien..."
          ></textarea>
        </div>
      </div>

      
      <div class="form-actions">
        <button v-if="isEdit" class="btn-cancel" @click="$emit('cancel')">Annuler</button>
        <button class="btn-save" @click="handleSave">Enregistrer</button>
      </div>
    </div>
  </ModalBase>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import ModalBase from './common/ModalBase.vue'

const toast = useToast()
const MAX_PHOTOS = 5

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['cancel', 'save'])

const fileInputRef = ref(null)

const defaultData = {
  libelle: '',
  adresse: '',
  typeBien: 'APPARTEMENT',
  surface: '',
  nombrePieces: 1,
  loyer: '',
  charges: '',
  description: '',
}

const formData = ref({ ...defaultData })
const photos = ref([])

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.initialData) {
        formData.value = {
          ...defaultData,
          libelle: props.initialData.libelle || props.initialData.intitule || '',
          adresse: props.initialData.adresse || props.initialData.localisation || '',
          typeBien: props.initialData.typeBien || 'APPARTEMENT',
          surface: props.initialData.surface || '',
          nombrePieces: props.initialData.nombrePieces || 1,
          loyer: props.initialData.loyer || '',
          charges: props.initialData.charges || '',
          description: props.initialData.description || '',
        }
        const existing = props.initialData.photos || []
        photos.value = existing.map((p) => ({ url: typeof p === 'string' ? p : (p.urlPhoto || p.url), file: null }))
      } else {
        formData.value = { ...defaultData }
        photos.value = []
      }
    }
  },
)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(event) {
  const files = event.target.files
  if (files && files.length > 0) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    let limiteAtteinte = false
    for (const file of files) {
      if (photos.value.length >= MAX_PHOTOS) {
        limiteAtteinte = true
        break
      }
      if (!allowedTypes.includes(file.type)) {
        console.warn(`Type de fichier non supporté : ${file.type}`)
        continue
      }
      const url = URL.createObjectURL(file)
      photos.value.push({ url, file })
    }
    if (limiteAtteinte) {
      toast.warning(`Vous pouvez ajouter au maximum ${MAX_PHOTOS} images.`)
    }
  }
  event.target.value = ''
}

function removePhoto(index) {
  const photo = photos.value[index]
  if (photo.file) URL.revokeObjectURL(photo.url)
  photos.value.splice(index, 1)
}

function buildFormData() {
  const fd = new FormData()

  for (const photo of photos.value) {
    if (photo.file) {
      fd.append('photos', photo.file, photo.file.name)
    }
  }

  const fields = formData.value
  if (fields.libelle) fd.append('libelle', fields.libelle)
  if (fields.adresse) fd.append('adresse', fields.adresse)
  if (fields.typeBien) fd.append('typeBien', fields.typeBien)
  if (fields.surface) fd.append('surface', String(fields.surface))
  if (fields.nombrePieces) fd.append('nombrePieces', String(fields.nombrePieces))
  if (fields.loyer) fd.append('loyer', String(fields.loyer))
  if (fields.charges) fd.append('charges', String(fields.charges))
  if (fields.description) fd.append('description', fields.description)
  if (!props.isEdit) {
    fd.append('statutBien', 'DISPONIBLE')
  } else if (props.initialData && props.initialData.statutBien) {
    fd.append('statutBien', props.initialData.statutBien)
  }

  return fd
}

function handleSave() {
  const fd = buildFormData()
  emit('save', fd)
}
</script>

<style scoped>
.form-content {
  padding: 32px;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.form-section {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-hint {
  font-weight: 400;
  font-size: 12px;
  color: #9ca3af;
}


.photos-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.photo-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.photo-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s;
}

.photo-remove:hover {
  background-color: rgba(239, 68, 68, 0.8);
}

.photo-add {
  width: 80px;
  height: 80px;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: #6b7280;
  font-size: 12px;
  transition: all 0.2s;
}

.photo-add:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.hidden-input {
  display: none;
}


.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  background-color: #f9fafb;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  background-color: white;
  border-color: #d1d5db;
  box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.08);
}

.textarea-input {
  resize: vertical;
  min-height: 80px;
}


.select-wrapper {
  position: relative;
}

.select-input {
  appearance: none;
  padding-right: 36px;
  cursor: pointer;
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}


.number-input-wrapper {
  position: relative;
  display: flex;
}

.number-input-wrapper input {
  appearance: textfield;
  padding-right: 30px;
}

.number-input-wrapper input::-webkit-outer-spin-button,
.number-input-wrapper input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.number-controls {
  position: absolute;
  right: 4px;
  top: 2px;
  bottom: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.number-btn {
  background: none;
  border: none;
  color: #9ca3af;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.number-btn:hover {
  color: #4b5563;
}


.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel,
.btn-save {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #f9fafb;
}

.btn-save {
  background-color: #1e293b;
  border: none;
  color: white;
}

.btn-save:hover {
  background-color: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
}
</style>
