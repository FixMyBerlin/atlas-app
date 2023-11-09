'use client'

export const ClientEnv: React.FC = () => {
  return (
    <div className="bg-amber-100 px-4 py-2">
      <code>
        <pre>
          NEXT_PUBLIC_APP_ORIGIN={process.env.NEXT_PUBLIC_APP_ORIGIN}<br/>
        </pre>
      </code>
    </div>
  )
}
