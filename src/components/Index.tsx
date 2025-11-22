import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchReadings } from '../api'
import { ReadingGroup } from '../types'
import { exportToPDF } from '../utils/pdfExport'

function Index() {
  const [groups, setGroups] = useState<ReadingGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
              onClick={() => exportToPDF(groups)}
              className="w-full sm:w-auto inline-block px-5 py-3 sm:py-2.5 rounded-md bg-secondary text-secondary-foreground font-medium text-center cursor-pointer border-none text-base hover:opacity-90 transition-opacity touch-manipulation"
            >
              Export to PDF
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
                              className="bg-muted px-3 py-2 rounded-md text-sm"
                            >
                              <span className="font-bold text-primary">
                                {entry.systolic}/{entry.diastolic}
                              </span>
                              <span className="text-muted-foreground text-xs ml-2">
                                {entry.time}
                              </span>
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
                              className="bg-muted px-3 py-2 rounded-md text-sm"
                            >
                              <span className="font-bold text-primary">
                                {entry.systolic}/{entry.diastolic}
                              </span>
                              <span className="text-muted-foreground text-xs ml-2">
                                {entry.time}
                              </span>
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
                              className="inline-block bg-muted px-2 py-1 rounded-md my-0.5 mr-1.5 text-sm"
                            >
                              <span className="font-bold text-primary">
                                {entry.systolic}/{entry.diastolic}
                              </span>
                              <span className="text-muted-foreground text-xs ml-1">
                                {entry.time}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-left border-b border-border">
                          {group.pm.map((entry, entryIdx) => (
                            <div
                              key={entryIdx}
                              className="inline-block bg-muted px-2 py-1 rounded-md my-0.5 mr-1.5 text-sm"
                            >
                              <span className="font-bold text-primary">
                                {entry.systolic}/{entry.diastolic}
                              </span>
                              <span className="text-muted-foreground text-xs ml-1">
                                {entry.time}
                              </span>
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
    </div>
  )
}

export default Index

