import React, { useState, ChangeEvent } from 'react'
import {
  Upload,
  X,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LucideIcon
} from 'lucide-react'
import AddressAutocomplete from './src/components/technicians/AddressAutocomplete'
import type { ParsedAddress } from './src/lib/utils'
  
const API_URL = 'http://qa-92rf.dentypro.com'

type TechnicianType = 'technician_company_admin' | 'technician_individual'

interface AddressData {
  country: string
  state: string
  city: string
  district: string
  postalCode: string
  addressLine: string
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
}

interface FormDataState {
  firstName: string
  lastName: string
  email: string
  telephoneNumber: string
  taxNumber: string
  companyName: string
  address: AddressData
}

interface FormErrors {
  [key: string]: string | null
}

interface SubmitStatus {
  type: 'success' | 'error'
  message: string
}

interface InputFieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  icon?: LucideIcon
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string | null
  disabled?: boolean
}

const initialAddressData: AddressData = {
  country: '',
  state: '',
  city: '',
  district: '',
  postalCode: '',
  addressLine: '',
  latitude: 0,
  longitude: 0,
  placeId: '',
  formattedAddress: ''
}

const initialFormData: FormDataState = {
  firstName: '',
  lastName: '',
  email: '',
  telephoneNumber: '',
  taxNumber: '',
  companyName: '',
  address: initialAddressData
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
  disabled = false
}) => (
  <div className='space-y-1.5'>
    <label className='text-sm font-medium text-gray-700 flex items-center gap-1'>
      {label} {required && <span className='text-red-500'>*</span>}
    </label>
    <div className='relative'>
      {Icon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2.5 ${Icon ? 'pl-10' : ''} border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
      />
    </div>
    {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
  </div>
)

const TechnicianCreateForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>(initialFormData)
  const [technicianType, setTechnicianType] = useState<TechnicianType>('technician_company_admin')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 5MB' }))
        return
      }
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
      setErrors(prev => ({ ...prev, photo: null }))
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
  }

  const handleAddressSelect = (parsedAddress: ParsedAddress) => {
    setFormData(prev => ({
      ...prev,
      address: {
        country: parsedAddress.country,
        state: parsedAddress.state,
        city: parsedAddress.city,
        district: parsedAddress.district || '',
        postalCode: parsedAddress.postalCode,
        addressLine: parsedAddress.addressLine,
        latitude: parsedAddress.latitude,
        longitude: parsedAddress.longitude,
        placeId: parsedAddress.placeId,
        formattedAddress: parsedAddress.formattedAddress
      }
    }))
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: null }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.telephoneNumber.trim()) newErrors.telephoneNumber = 'Phone number is required'
    if (!formData.address.placeId) newErrors.address = 'Address is required'
    if (technicianType === 'technician_company_admin' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required for corporate accounts'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    const data = new FormData()
    data.append('firstName', formData.firstName)
    data.append('lastName', formData.lastName)
    data.append('email', formData.email)
    data.append('telephoneNumber', formData.telephoneNumber)
    data.append('address', formData.address.addressLine)
    data.append('city', formData.address.city)
    data.append('zipCode', formData.address.postalCode)
    data.append('taxNumber', formData.taxNumber)
    data.append('country', formData.address.country)
    data.append('state', formData.address.state)
    data.append('type', technicianType)
    data.append('latitude', formData.address.latitude.toString())
    data.append('longitude', formData.address.longitude.toString())

    if (technicianType === 'technician_company_admin' && formData.companyName) {
      data.append('companyName', formData.companyName)
    }

    if (photo) {
      data.append('photo', photo)
    }

    try {
      const response = await fetch(`${API_URL}/idam/user`, {
        method: 'POST',
        body: data
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Technician created successfully!' })
        setFormData(initialFormData)
        setPhoto(null)
        setPhotoPreview(null)
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to create technician'
        })
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          {/* Header */}
          <div className='bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8'>
            <h1 className='text-2xl font-bold text-white'>Create New Technician</h1>
            <p className='text-blue-100 mt-1'>Fill in the details to register a new technician</p>
          </div>

          <div className='p-6 space-y-6'>
            {/* Technician Type */}
            <div className='space-y-3'>
              <label className='text-sm font-medium text-gray-700'>Account Type</label>
              <div className='flex gap-4'>
                <label
                  className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      technicianType === 'technician_company_admin'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type='radio'
                    name='technicianType'
                    value='technician_company_admin'
                    checked={technicianType === 'technician_company_admin'}
                    onChange={e => setTechnicianType(e.target.value as TechnicianType)}
                    className='w-4 h-4 text-blue-600'
                  />
                  <Building2
                    size={20}
                    className={technicianType === 'technician_company_admin' ? 'text-blue-600' : 'text-gray-400'}
                  />
                  <div>
                    <p className='font-medium text-gray-900'>Corporate</p>
                    <p className='text-xs text-gray-500'>For company accounts</p>
                  </div>
                </label>

                <label
                  className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      technicianType === 'technician_individual'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type='radio'
                    name='technicianType'
                    value='technician_individual'
                    checked={technicianType === 'technician_individual'}
                    onChange={e => setTechnicianType(e.target.value as TechnicianType)}
                    className='w-4 h-4 text-blue-600'
                  />
                  <User
                    size={20}
                    className={technicianType === 'technician_individual' ? 'text-blue-600' : 'text-gray-400'}
                  />
                  <div>
                    <p className='font-medium text-gray-900'>Individual</p>
                    <p className='text-xs text-gray-500'>For solo technicians</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Photo Upload */}
            <div className='space-y-3'>
              <label className='text-sm font-medium text-gray-700'>Profile Photo</label>
              <div className='flex items-center gap-4'>
                {photoPreview ? (
                  <div className='relative'>
                    <img
                      src={photoPreview}
                      alt='Preview'
                      className='w-24 h-24 rounded-xl object-cover border-2 border-gray-200'
                    />
                    <button
                      type='button'
                      onClick={removePhoto}
                      className='absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className='w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all'>
                    <Upload size={24} className='text-gray-400' />
                    <span className='text-xs text-gray-500 mt-1'>Upload</span>
                    <input type='file' accept='image/*' onChange={handlePhotoChange} className='hidden' />
                  </label>
                )}
                <div className='text-sm text-gray-500'>
                  <p>Upload a profile photo</p>
                  <p className='text-xs'>Max 5MB, JPG or PNG</p>
                </div>
              </div>
              {errors.photo && <p className='text-xs text-red-500'>{errors.photo}</p>}
            </div>

            {/* Personal Info */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <User size={20} className='text-blue-600' />
                Personal Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <InputField
                  label='First Name'
                  name='firstName'
                  required
                  placeholder='John'
                  icon={User}
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <InputField
                  label='Last Name'
                  name='lastName'
                  required
                  placeholder='Doe'
                  icon={User}
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
                <InputField
                  label='Email'
                  name='email'
                  type='email'
                  required
                  placeholder='john@example.com'
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <InputField
                  label='Phone Number'
                  name='telephoneNumber'
                  required
                  placeholder='+1234567890'
                  icon={Phone}
                  value={formData.telephoneNumber}
                  onChange={handleChange}
                  error={errors.telephoneNumber}
                />
              </div>
            </div>

            {/* Company Info - Conditional */}
            {technicianType === 'technician_company_admin' && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                  <Building2 size={20} className='text-blue-600' />
                  Company Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <InputField
                    label='Company Name'
                    name='companyName'
                    required
                    placeholder='Acme Labs'
                    icon={Building2}
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                  />
                  <InputField
                    label='Tax Number'
                    name='taxNumber'
                    placeholder='ABC123456'
                    icon={FileText}
                    value={formData.taxNumber}
                    onChange={handleChange}
                    error={errors.taxNumber}
                  />
                </div>
              </div>
            )}

            {/* Address Info */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <MapPin size={20} className='text-blue-600' />
                Address Information
              </h3>

              {/* Address Autocomplete */}
              <AddressAutocomplete
                onSelect={handleAddressSelect}
                selectedAddress={
                  formData.address.placeId
                    ? {
                        country: formData.address.country,
                        state: formData.address.state,
                        city: formData.address.city,
                        district: formData.address.district,
                        postalCode: formData.address.postalCode,
                        addressLine: formData.address.addressLine,
                        latitude: formData.address.latitude,
                        longitude: formData.address.longitude,
                        placeId: formData.address.placeId,
                        formattedAddress: formData.address.formattedAddress
                      }
                    : null
                }
                error={errors.address || undefined}
              />

              {/* Address Detail Fields - Auto-filled from Google */}
              {formData.address.placeId && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl'>
                  <InputField
                    label='Address Line'
                    name='addressLine'
                    value={formData.address.addressLine}
                    onChange={() => {}}
                    disabled
                    icon={MapPin}
                  />
                  <InputField label='City' name='city' value={formData.address.city} onChange={() => {}} disabled />
                  <InputField label='State' name='state' value={formData.address.state} onChange={() => {}} disabled />
                  <InputField
                    label='Zip Code'
                    name='postalCode'
                    value={formData.address.postalCode}
                    onChange={() => {}}
                    disabled
                  />
                  <InputField
                    label='Country'
                    name='country'
                    value={formData.address.country}
                    onChange={() => {}}
                    disabled
                  />
                  <InputField
                    label='District'
                    name='district'
                    value={formData.address.district}
                    onChange={() => {}}
                    disabled
                  />
                  <InputField
                    label='Latitude'
                    name='latitude'
                    value={formData.address.latitude.toString()}
                    onChange={() => {}}
                    disabled
                  />
                  <InputField
                    label='Longitude'
                    name='longitude'
                    value={formData.address.longitude.toString()}
                    onChange={() => {}}
                    disabled
                  />
                </div>
              )}
            </div>

            {/* Submit Status */}
            {submitStatus && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {submitStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className='font-medium'>{submitStatus.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='button'
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='w-full py-3 px-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl
                hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200
                flex items-center justify-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className='animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Technician'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnicianCreateForm
