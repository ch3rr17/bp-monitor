import { useState, FormEvent, useEffect } from 'react'
import { updateReading } from '../api'
import { Reading } from '../types'
import { X } from 'lucide-react'

interface EditEntryProps {
  reading: Reading
  onClose: () => void
  onSuccess: () => void
}

function EditEntry({ reading, onClose, onSuccess }: EditEntryProps) {
  const [systolic, setSystolic] = useState(reading.systolic.toString())
  const [diastolic, setDiastolic] = useState(reading.diastolic.toString())
  const [heartRate, setHeartRate] = useState(reading.heartRate?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    const sysNum = parseInt(systolic)
    const diaNum = parseInt(diastolic)
    const hrNum = heartRate ? parseInt(heartRate) : null

    if (isNaN(sysNum) || isNaN(diaNum)) {
      setError('Please enter valid numbers for blood pressure')
      return
    }

    if (sysNum < 50 || sysNum > 300) {
      setError('Systolic must be between 50 and 300')
      return
    }

    if (diaNum < 30 || diaNum > 200) {
      setError('Diastolic must be between 30 and 200')
      return
    }

    if (heartRate && (isNaN(hrNum!) || hrNum! < 30 || hrNum! > 250)) {
      setError('Heart rate must be between 30 and 250 bpm')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await updateReading(reading.id, sysNum, diaNum, hrNum)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entry')
    } finally {
      setLoading(false)
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-card text-card-foreground rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-primary">Edit Reading</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="edit-systolic"
              className="block mb-2 font-medium text-sm"
            >
              Systolic (Top)
            </label>
            <input
              type="number"
              id="edit-systolic"
              name="systolic"
              required
              min="50"
              max="300"
              placeholder="120"
              autoFocus
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full px-3 py-2.5 border border-input rounded-md text-base box-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="edit-diastolic"
              className="block mb-2 font-medium text-sm"
            >
              Diastolic (Bottom)
            </label>
            <input
              type="number"
              id="edit-diastolic"
              name="diastolic"
              required
              min="30"
              max="200"
              placeholder="80"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full px-3 py-2.5 border border-input rounded-md text-base box-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="edit-heartRate"
              className="block mb-2 font-medium text-sm"
            >
              Heart Rate (bpm) <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="number"
              id="edit-heartRate"
              name="heartRate"
              min="30"
              max="250"
              placeholder="72"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              className="w-full px-3 py-2.5 border border-input rounded-md text-base box-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring"
            />
          </div>
          
          {error && (
            <div className="mb-4 text-destructive text-sm">{error}</div>
          )}
          
          <div className="flex gap-2.5 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium cursor-pointer border-none text-base hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 rounded-md bg-secondary text-secondary-foreground font-medium cursor-pointer border-none text-base hover:opacity-90 transition-opacity"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEntry

