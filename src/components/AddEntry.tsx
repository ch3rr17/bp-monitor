import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReading } from '../api'

function AddEntry() {
  const navigate = useNavigate()
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [heartRate, setHeartRate] = useState('')
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
      await createReading(sysNum, diaNum, hrNum)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-5">
      <div className="max-w-md mx-auto bg-card text-card-foreground p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-center mt-0 mb-4 sm:mb-6 text-primary text-2xl sm:text-3xl font-bold">
          Add Blood Pressure
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-5">
            <label
              htmlFor="systolic"
              className="block mb-2 font-medium text-sm sm:text-base"
            >
              Systolic (Top)
            </label>
            <input
              type="number"
              id="systolic"
              name="systolic"
              required
              min="50"
              max="300"
              placeholder="120"
              autoFocus
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full px-3 py-3 sm:py-2.5 border border-input rounded-md text-base box-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring touch-manipulation"
            />
          </div>
          <div className="mb-4 sm:mb-5">
            <label
              htmlFor="diastolic"
              className="block mb-2 font-medium text-sm sm:text-base"
            >
              Diastolic (Bottom)
            </label>
            <input
              type="number"
              id="diastolic"
              name="diastolic"
              required
              min="30"
              max="200"
              placeholder="80"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full px-3 py-3 sm:py-2.5 border border-input rounded-md text-base box-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring touch-manipulation"
            />
          </div>
          <div className="mb-4 sm:mb-5">
            <label
              htmlFor="heartRate"
              className="block mb-2 font-medium text-sm sm:text-base"
            >
              Heart Rate (bpm) <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="number"
              id="heartRate"
              name="heartRate"
              min="30"
              max="250"
              placeholder="72"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              className="w-full px-3 py-3 sm:py-2.5 border border-input rounded-md text-base box-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring touch-manipulation"
            />
          </div>
          {error && (
            <div className="mb-4 sm:mb-5 text-destructive text-sm px-1">{error}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2.5 mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-block px-5 py-3 sm:py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-center cursor-pointer border-none text-base hover:opacity-90 transition-opacity disabled:opacity-50 touch-manipulation"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 inline-block px-5 py-3 sm:py-2.5 rounded-md bg-secondary text-secondary-foreground font-medium text-center cursor-pointer border-none text-base hover:opacity-90 transition-opacity touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEntry

