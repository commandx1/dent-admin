import React, { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
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
  Camera,
  Briefcase,
  Trash2,
  Wrench,
  Check,
  UserPlus,
  Users
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AddressAutocomplete from './AddressAutocomplete'
import { AddEmployeeModal } from './AddEmployeeModal'
import type { ParsedAddress } from '@/lib/utils'
import type { CompanyMember } from './types'
import { technicianService } from '@/services/technicianService'
import api from '@/lib/api'

const CAPABILITIES = [
  { id: 1, label: 'Panoramic 2D/3D CBCT' },
  { id: 2, label: 'General Equipment (Chair, Delivery System, Autoclave, Pump, Compressor, Cavitron, Ultrasonic, Wall Mount X-Ray, Dental Light)' },
  { id: 3, label: 'Hand Pieces' }
]

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
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
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
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-slate-700'>
      {label} {required && <span className='text-accent-danger'>*</span>}
    </label>
    <div className='relative group'>
      {Icon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-primary transition-colors'>
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
        className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 ${Icon ? 'pl-10' : ''} text-slate-900 placeholder-slate-400 
          focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all
          ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed opacity-75' : 'hover:border-slate-300'}
          ${error ? 'border-accent-danger bg-red-50 focus:ring-accent-danger/20' : ''}`}
      />
    </div>
    {error && <p className='text-xs text-accent-danger font-medium mt-1 ml-1'>{error}</p>}
  </div>
)

const NewTechnician: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>(initialFormData)
  const [technicianType, setTechnicianType] = useState<TechnicianType>('technician_company_admin')
  const [selectedCapabilities, setSelectedCapabilities] = useState<number[]>([])
  const [members, setMembers] = useState<CompanyMember[]>([])
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const toggleCapability = (id: number) => {
    setSelectedCapabilities(prev => 
      prev.includes(id) ? prev.filter(capId => capId !== id) : [...prev, id]
    )
  }

  const addMember = (member: CompanyMember) => {
    setMembers(prev => [...prev, member])
  }

  const removeMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index))
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
    if (!formData.taxNumber.trim()) newErrors.taxNumber = 'Tax number is required'
    if (!formData.address.placeId) newErrors.address = 'Address is required'
    if (technicianType === 'technician_company_admin' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required for corporate accounts'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
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
      const response = await api.post('/api/dentypro/idam/user', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200 || response.status === 201) {
        const userId = response.data?.user_id || response.data?.id
        let finalCompanyId = userId

        // If it's a corporate account, we need to find the companyId from the list
        if (technicianType === 'technician_company_admin' && userId) {
          try {
            const techList = await technicianService.getAll(0, 5)
            const matchingCompany = techList.content.find(c => c.ownerUserId === userId)
            if (matchingCompany) {
              finalCompanyId = matchingCompany.companyId
            }
          } catch (listError) {
            console.error('Error fetching technician list to find companyId:', listError)
          }
        }

        // Create members if any and we have a companyId
        if (finalCompanyId && members.length > 0) {
          for (const member of members) {
            try {
              await api.post('/api/dentypro/technician/technician', {
                ...member,
                company_id: finalCompanyId
              }, {
                headers: {
                  'Authorization': `Bearer ${import.meta.env.VITE_TECHNICIAN_USER_ACCESS_TOKEN}`,
                  'X-Refresh-Token': import.meta.env.VITE_TECHNICIAN_USER_REFRESH_TOKEN
                }
              })
            } catch (memberError) {
              console.error('Error creating member:', memberError)
            }
          }
        }

        // Send capabilities if any are selected and we have a userId
        if (userId && selectedCapabilities.length > 0) {
          try {
            await api.post('/api/dentypro/technician/capabilities', {
              capability_ids: selectedCapabilities,
              user_id: userId
            })
          } catch (capError) {
            console.error('Error saving capabilities:', capError)
          }
        }

        setSubmitStatus({ type: 'success', message: 'Technician created successfully!' })
        setFormData(initialFormData)
        setSelectedCapabilities([])
        setMembers([])
        setPhoto(null)
        setPhotoPreview(null)
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.data?.message || 'Failed to create technician'
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.'
      const axiosError = error as { response?: { data?: { message?: string } } }
      setSubmitStatus({
        type: 'error',
        message: axiosError.response?.data?.message || errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-dark-bg overflow-y-auto'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Technician Type Selector */}
        <section id='technician-type-selector'>
          <div className='bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-sm'>
            <div className='mb-8'>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>Select Technician Type</h3>
              <p className='text-slate-500'>Choose whether this is a company or individual technician</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div
                onClick={() => setTechnicianType('technician_company_admin')}
                className={`bg-slate-50 border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md ${
                  technicianType === 'technician_company_admin'
                    ? 'border-accent-primary ring-1 ring-accent-primary/10'
                    : 'border-slate-200'
                }`}
              >
                <div className='flex items-start gap-5'>
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      technicianType === 'technician_company_admin'
                        ? 'bg-accent-primary text-white'
                        : 'bg-white text-slate-400'
                    }`}
                  >
                    <Building2 size={28} />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='text-slate-900 font-bold text-lg'>Company</h4>
                      {technicianType === 'technician_company_admin' && (
                        <span className='px-3 py-1 bg-accent-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest text-nowrap'>
                          Selected
                        </span>
                      )}
                    </div>
                    <p className='text-slate-500 text-sm mb-4 leading-relaxed'>
                      Associated with a registered company. Requires company name and Tax ID (EIN).
                    </p>
                    <div className='flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter'>
                      <span className='flex items-center gap-1.5 shrink-0'>
                        <CheckCircle2 size={14} className='text-accent-success' /> Company Name
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      technicianType === 'technician_company_admin'
                        ? 'bg-accent-primary border-accent-primary text-white scale-110'
                        : 'border-slate-300'
                    }`}
                  >
                    {technicianType === 'technician_company_admin' && <CheckCircle2 size={16} />}
                  </div>
                </div>
              </div>

              <div
                onClick={() => setTechnicianType('technician_individual')}
                className={`bg-slate-50 border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md ${
                  technicianType === 'technician_individual'
                    ? 'border-accent-secondary ring-1 ring-accent-secondary/10'
                    : 'border-slate-200'
                }`}
              >
                <div className='flex items-start gap-5'>
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      technicianType === 'technician_individual'
                        ? 'bg-accent-secondary text-white'
                        : 'bg-white text-slate-400'
                    }`}
                  >
                    <User size={28} />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='text-slate-900 font-bold text-lg'>Individual Technician</h4>
                      {technicianType === 'technician_individual' && (
                        <span className='px-3 py-1 bg-accent-secondary text-white text-[10px] font-black rounded-full uppercase tracking-widest text-nowrap'>
                          Selected
                        </span>
                      )}
                    </div>
                    <p className='text-slate-500 text-sm mb-4 leading-relaxed'>
                      Independent technician working as a sole proprietor. No company affiliation required.
                    </p>
                    <div className='flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter'>
                      <span className='flex items-center gap-1.5 shrink-0'>
                        <CheckCircle2 size={14} className='text-accent-success' /> Personal Info
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      technicianType === 'technician_individual'
                        ? 'bg-accent-secondary border-accent-secondary text-white scale-110'
                        : 'border-slate-300'
                    }`}
                  >
                    {technicianType === 'technician_individual' && <CheckCircle2 size={16} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Profile Photo Section */}
          <section id='profile-photo-section'>
            <div className='bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-sm'>
              <h3 className='text-xl font-bold text-slate-900 mb-8 flex items-center gap-3'>
                <div className='w-10 h-10 bg-accent-primary/10 rounded-xl flex items-center justify-center'>
                  <Camera size={22} className='text-accent-primary' />
                </div>
                Profile Photo
              </h3>
              <div className='flex flex-col md:flex-row items-center md:items-start gap-10'>
                <div className='relative'>
                  <div className='w-40 h-40 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden ring-1 ring-slate-200'>
                    {photoPreview ? (
                      <img src={photoPreview} alt='Preview' className='w-full h-full object-cover' />
                    ) : (
                      <User size={60} className='text-slate-300' />
                    )}
                  </div>
                  {photoPreview && (
                    <button
                      type='button'
                      onClick={removePhoto}
                      className='absolute -top-1 -right-1 w-10 h-10 bg-accent-danger text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors border-4 border-white z-10'
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <label className='absolute bottom-1 right-1 w-12 h-12 bg-accent-primary rounded-full flex items-center justify-center text-white cursor-pointer shadow-xl hover:bg-accent-primary/90 transition-all border-4 border-white'>
                    <Camera size={20} />
                    <input type='file' name='photo' accept='image/*' onChange={handlePhotoChange} className='hidden' />
                  </label>
                </div>
                <div className='flex-1 w-full space-y-6'>
                  <label className='block'>
                    <div className='border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-accent-primary hover:bg-slate-50/50 transition-all cursor-pointer group'>
                      <Upload
                        size={40}
                        className='text-slate-300 group-hover:text-accent-primary mx-auto mb-4 transition-colors'
                      />
                      <p className='text-slate-900 font-bold text-lg mb-1'>Click to upload or drag and drop</p>
                      <p className='text-sm text-slate-500 font-medium'>PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input type='file' name='photo' accept='image/*' onChange={handlePhotoChange} className='hidden' />
                  </label>
                  <div className='flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg w-fit'>
                    <AlertCircle size={14} className='text-accent-primary' /> Recommended: Square image, 400x400px
                  </div>
                  {errors.photo && <p className='text-sm text-accent-danger font-bold mt-2'>{errors.photo}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information Section */}
          <section id='personal-info-section'>
            <div className='bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-sm'>
              <h3 className='text-xl font-bold text-slate-900 mb-8 flex items-center gap-3'>
                <div className='w-10 h-10 bg-accent-primary/10 rounded-xl flex items-center justify-center'>
                  <User size={22} className='text-accent-primary' />
                </div>
                Personal Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8'>
                <InputField
                  label='First Name'
                  name='firstName'
                  required
                  placeholder='Enter first name'
                  icon={User}
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <InputField
                  label='Last Name'
                  name='lastName'
                  required
                  placeholder='Enter last name'
                  icon={User}
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
                <InputField
                  label='Email Address'
                  name='email'
                  type='email'
                  required
                  placeholder='technician@example.com'
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <InputField
                  label='Phone Number'
                  name='telephoneNumber'
                  required
                  placeholder='+1 (555) 000-0000'
                  icon={Phone}
                  value={formData.telephoneNumber}
                  onChange={handleChange}
                  error={errors.telephoneNumber}
                />
                <InputField
                  label='Tax Number'
                  name='taxNumber'
                  required
                  placeholder='Enter tax number'
                  icon={FileText}
                  value={formData.taxNumber}
                  onChange={handleChange}
                  error={errors.taxNumber}
                />
              </div>
            </div>
          </section>

          {/* Company Information Section (Conditional) */}
          {technicianType === 'technician_company_admin' && (
            <section id='company-info-section'>
              <div className='bg-dark-surface border-2 border-accent-primary/20 rounded-2xl p-8 shadow-sm relative overflow-hidden'>
                <div className='absolute top-0 right-0 p-4'>
                  <span className='px-4 py-1.5 bg-accent-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm'>
                    Company Account
                  </span>
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-8 flex items-center gap-3'>
                  <div className='w-10 h-10 bg-accent-primary/10 rounded-xl flex items-center justify-center'>
                    <Briefcase size={22} className='text-accent-primary' />
                  </div>
                  Company Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8'>
                  <InputField
                    label='Company Name'
                    name='companyName'
                    required
                    placeholder='Enter company name'
                    icon={Building2}
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Company Members Section (Conditional) */}
          {technicianType === 'technician_company_admin' && (
            <section id='company-members-section'>
              <div className='bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-sm'>
                <div className='flex items-center justify-between mb-8'>
                  <h3 className='text-xl font-bold text-slate-900 flex items-center gap-3'>
                    <div className='w-10 h-10 bg-accent-secondary/10 rounded-xl flex items-center justify-center'>
                      <Users size={22} className='text-accent-secondary' />
                    </div>
                    Company Members
                  </h3>
                  <button
                    type='button'
                    onClick={() => setIsMemberModalOpen(true)}
                    className='px-4 py-2 bg-accent-secondary/10 text-accent-secondary hover:bg-accent-secondary/20 rounded-xl font-bold transition-all flex items-center gap-2 text-sm'
                  >
                    <UserPlus size={18} /> Add Member
                  </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {members.length === 0 ? (
                    <div className='md:col-span-2 py-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl'>
                      <p className='text-slate-400 font-medium'>No members added yet. Click "Add Member" to include team members.</p>
                    </div>
                  ) : (
                    members.map((member, index) => (
                      <div key={index} className='bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm group hover:border-accent-secondary transition-all'>
                        <div className='flex items-center gap-4'>
                          <div className='w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center'>
                            <User size={20} className='text-slate-400' />
                          </div>
                          <div>
                            <p className='text-slate-900 font-bold'>{member.user_first_name} {member.user_last_name}</p>
                            <p className='text-slate-500 text-xs'>{member.email}</p>
                          </div>
                        </div>
                        <button
                          type='button'
                          onClick={() => removeMember(index)}
                          className='p-2 text-slate-400 hover:text-accent-danger hover:bg-red-50 rounded-lg transition-all'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Address Information Section */}
          <section id='address-section'>
            <div className='bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-sm'>
              <h3 className='text-xl font-bold text-slate-900 mb-8 flex items-center gap-3'>
                <div className='w-10 h-10 bg-accent-primary/10 rounded-xl flex items-center justify-center'>
                  <MapPin size={22} className='text-accent-primary' />
                </div>
                Address Information
              </h3>
              <div className='space-y-8'>
                <AddressAutocomplete
                  onSelect={handleAddressSelect}
                  selectedAddress={formData.address.placeId ? formData.address : null}
                  error={errors.address || undefined}
                />

                {formData.address.placeId && (
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50 p-8 rounded-3xl border border-slate-200'>
                    <div className='md:col-span-3'>
                      <label className='block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest'>
                        Street Address
                      </label>
                      <div className='text-slate-900 font-bold p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-lg'>
                        {formData.address.addressLine}
                      </div>
                    </div>
                    <div>
                      <label className='block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest'>
                        City
                      </label>
                      <div className='text-slate-900 font-bold p-5 bg-white border border-slate-200 rounded-2xl shadow-sm'>
                        {formData.address.city || '--'}
                      </div>
                    </div>
                    <div>
                      <label className='block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest'>
                        State
                      </label>
                      <div className='text-slate-900 font-bold p-5 bg-white border border-slate-200 rounded-2xl shadow-sm'>
                        {formData.address.state || '--'}
                      </div>
                    </div>
                    <div>
                      <label className='block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest'>
                        ZIP Code
                      </label>
                      <div className='text-slate-900 font-bold p-5 bg-white border border-slate-200 rounded-2xl shadow-sm'>
                        {formData.address.postalCode || '--'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Technician Capabilities Section */}
          <section id='capabilities-section'>
            <div className='bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-sm'>
              <h3 className='text-xl font-bold text-slate-900 mb-8 flex items-center gap-3'>
                <div className='w-10 h-10 bg-accent-primary/10 rounded-xl flex items-center justify-center'>
                  <Wrench size={22} className='text-accent-primary' />
                </div>
                Technician Capabilities
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <p className='text-sm text-slate-500 mb-2'>Select the equipment types the technician is capable of servicing:</p>
                <div className='flex flex-wrap gap-3'>
                  {CAPABILITIES.map((cap) => (
                    <button
                      key={cap.id}
                      type='button'
                      onClick={() => toggleCapability(cap.id)}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all text-left max-w-2xl ${
                        selectedCapabilities.includes(cap.id)
                          ? 'border-accent-primary bg-accent-primary/5 text-slate-900 shadow-sm'
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <div className={`min-w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                        selectedCapabilities.includes(cap.id)
                          ? 'bg-accent-primary border-accent-primary text-white'
                          : 'bg-white border-slate-200'
                      }`}>
                        {selectedCapabilities.includes(cap.id) && <Check size={14} strokeWidth={4} />}
                      </div>
                      <span className='font-bold text-sm'>{cap.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {submitStatus && (
            <div
              className={`flex items-center gap-5 p-6 rounded-3xl border-2 animate-in fade-in slide-in-from-bottom-6 duration-500 ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800 shadow-xl shadow-green-500/10'
                  : 'bg-red-50 border-red-200 text-red-800 shadow-xl shadow-red-500/10'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  submitStatus.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {submitStatus.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <p className='font-black text-2xl uppercase tracking-tighter'>{submitStatus.message}</p>
            </div>
          )}

          {/* Submit Status & Requirements Info */}
          <section className='space-y-10 shadow-sm rounded-2xl overflow-hidden'>
            {/* Form Actions */}
            <div className='bg-dark-surface border-t-2 border-slate-100 px-6 py-4'>
              <div className='flex flex-col sm:flex-row items-center justify-between gap-8'>
                <button
                  type='button'
                  onClick={() => window.history.back()}
                  className='flex-1 sm:flex-none px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black transition-all flex items-center justify-center gap-3 border-2 border-slate-200 shadow-sm uppercase tracking-wider text-sm'
                >
                  <X size={20} /> Cancel
                </button>
                <div className='flex items-center gap-5 w-full sm:w-auto'>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full sm:w-auto px-8 py-3 bg-linear-to-r from-accent-primary to-indigo-600 text-white font-black rounded-2xl hover:opacity-95 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:scale-100 transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-500/30 text-sm uppercase tracking-widest'
                  >
                    {isSubmitting ? <Loader2 size={28} className='animate-spin' /> : <CheckCircle2 size={28} />}
                    {isSubmitting ? 'Creating...' : 'Create Technician'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>

      <AddEmployeeModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        companyName={formData.companyName || 'New Company'}
        onAdd={addMember}
      />
    </div>
  )
}

export default NewTechnician
