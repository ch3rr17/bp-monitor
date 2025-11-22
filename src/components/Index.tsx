import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchReadings } from '../api'
import { ReadingGroup, Reading } from '../types'
import { Pencil } from 'lucide-react'
import EditEntry from './EditEntry'

function Index() {
  const [groups, setGroups] = useState<ReadingGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingReading, setEditingReading] = useState<Reading | null>(null)
  const [exportingPDF, setExportingPDF] = useState(false)

  useEffect(() => {
    loadReadings()
  }, [])

  const loadReadings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchReadings()
      setGroups(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load readings')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-5 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-3 sm:p-4 md:p-5 flex items-center justify-center">
        <div className="text-destructive text-center px-4">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-5">
      <div className="max-w-4xl mx-auto bg-card text-card-foreground p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <h1 className="text-center mt-0 mb-4 sm:mb-6 text-primary text-2xl sm:text-3xl font-bold">
          Blood Pressure Log
        </h1>
        
        {/* Mobile-first button layout */}
        <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row gap-2 sm:gap-2.5 sm:justify-end">
          {groups.length > 0 && (
            <button
              onClick={async () => {
                try {
                  setExportingPDF(true)
                  const { exportToPDF } = await import('../utils/pdfExport')
                  await exportToPDF(groups)
                } catch (err) {
                  console.error('Failed to export PDF:', err)
                  alert('Failed to export PDF. Please try again.')
                } finally {
                  setExportingPDF(false)
                }
              }}
              disabled={exportingPDF}
              className="w-full sm:w-auto inline-block px-5 py-3 sm:py-2.5 rounded-md bg-secondary text-secondary-foreground font-medium text-center cursor-pointer border-none text-base hover:opacity-90 transition-opacity touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingPDF ? 'Exporting...' : 'Export to PDF'}
            </button>
          )}
          <Link
            to="/add"
            className="w-full sm:w-auto inline-block px-5 py-3 sm:py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-center no-underline cursor-pointer border-none text-base hover:opacity-90 transition-opacity touch-manipulation"
          >
            Add New Entry
          </Link>
        </div>

        {/* Mobile: Card layout, Desktop: Table layout */}
        <div className="mt-4 sm:mt-5">
          {groups.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 px-0">
              No entries yet.
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {groups.map((group, idx) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-4 bg-muted/30"
                  >
                    <div className="font-semibold text-lg mb-3 text-primary border-b border-border pb-2">
                      {group.date}
                    </div>
                    
                    {group.am.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          AM Readings
                        </div>
                        <div className="flex flex-wrap gap-2">
                    {group.am.map((entry, entryIdx) => (
                      <div
                        key={entryIdx}
                        className="bg-muted px-3 py-2 rounded-md text-sm flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center flex-wrap gap-1.5">
                          <span className="font-bold text-primary">
                            {entry.systolic}/{entry.diastolic}
                          </span>
                          {entry.heartRate && (
                            <span className="text-accent-foreground font-medium">
                              HR: {entry.heartRate}
                            </span>
                          )}
                          <span className="text-muted-foreground text-xs">
                            {entry.time}
                          </span>
                          {entry.editedAt && (
                            <span className="text-muted-foreground text-xs italic">
                              (edited {new Date(entry.editedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })})
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingReading(entry)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1 touch-manipulation"
                          aria-label="Edit entry"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    ))}
                        </div>
                      </div>
                    )}
                    
                    {group.pm.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                          PM Readings
                        </div>
                        <div className="flex flex-wrap gap-2">
                    {group.pm.map((entry, entryIdx) => (
                      <div
                        key={entryIdx}
                        className="bg-muted px-3 py-2 rounded-md text-sm flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center flex-wrap gap-1.5">
                          <span className="font-bold text-primary">
                            {entry.systolic}/{entry.diastolic}
                          </span>
                          {entry.heartRate && (
                            <span className="text-accent-foreground font-medium">
                              HR: {entry.heartRate}
                            </span>
                          )}
                          <span className="text-muted-foreground text-xs">
                            {entry.time}
                          </span>
                          {entry.editedAt && (
                            <span className="text-muted-foreground text-xs italic">
                              (edited {new Date(entry.editedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })})
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setEditingReading(entry)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1 touch-manipulation"
                          aria-label="Edit entry"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    ))}
                        </div>
                      </div>
                    )}
                    
                    {group.am.length === 0 && group.pm.length === 0 && (
                      <div className="text-muted-foreground text-sm">No readings for this date</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left border-b border-border bg-muted font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left border-b border-border bg-muted font-semibold">
                        AM Readings
                      </th>
                      <th className="px-4 py-3 text-left border-b border-border bg-muted font-semibold">
                        PM Readings
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-left border-b border-border font-medium whitespace-nowrap">
                          {group.date}
                        </td>
                        <td className="px-4 py-3 text-left border-b border-border">
                          {group.am.map((entry, entryIdx) => (
                            <div
                              key={entryIdx}
                              className="inline-flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md my-0.5 mr-1.5 text-sm"
                            >
                              <div className="flex items-center flex-wrap gap-1">
                                <span className="font-bold text-primary">
                                  {entry.systolic}/{entry.diastolic}
                                </span>
                                {entry.heartRate && (
                                  <span className="text-accent-foreground font-medium">
                                    HR: {entry.heartRate}
                                  </span>
                                )}
                                <span className="text-muted-foreground text-xs">
                                  {entry.time}
                                </span>
                                {entry.editedAt && (
                                  <span className="text-muted-foreground text-xs italic">
                                    (edited {new Date(entry.editedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })})
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => setEditingReading(entry)}
                                className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                                aria-label="Edit entry"
                              >
                                <Pencil size={12} />
                              </button>
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-left border-b border-border">
                          {group.pm.map((entry, entryIdx) => (
                            <div
                              key={entryIdx}
                              className="inline-flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md my-0.5 mr-1.5 text-sm"
                            >
                              <div className="flex items-center flex-wrap gap-1">
                                <span className="font-bold text-primary">
                                  {entry.systolic}/{entry.diastolic}
                                </span>
                                {entry.heartRate && (
                                  <span className="text-accent-foreground font-medium">
                                    HR: {entry.heartRate}
                                  </span>
                                )}
                                <span className="text-muted-foreground text-xs">
                                  {entry.time}
                                </span>
                                {entry.editedAt && (
                                  <span className="text-muted-foreground text-xs italic">
                                    (edited {new Date(entry.editedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })})
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => setEditingReading(entry)}
                                className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                                aria-label="Edit entry"
                              >
                                <Pencil size={12} />
                              </button>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      
      {editingReading && (
        <EditEntry
          reading={editingReading}
          onClose={() => setEditingReading(null)}
          onSuccess={() => {
            loadReadings()
            setEditingReading(null)
          }}
        />
      )}
    </div>
  )
}

export default Index

