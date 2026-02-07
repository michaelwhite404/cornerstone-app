import classNames from "classnames";

export interface TabOption<T> {
  name: string;
  count?: number | string;
  value: T;
}

interface Tabs2Props<T> {
  tabs: TabOption<T>[];
  value: T;
  onChange: (tab: TabOption<T>) => void;
}

export default function Tabs2<T extends string>(props: Tabs2Props<T>) {
  const { tabs, value, onChange } = props;
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={value}
          onChange={({ target: { value } }) => onChange(tabs.find((tab) => tab.value === value)!)}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const current = tab.value === value;
              return (
                <button
                  key={tab.name}
                  className={classNames(
                    current
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200",
                    "whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm"
                  )}
                  aria-current={current ? "page" : undefined}
                  onClick={() => onChange(tab)}
                >
                  {tab.name}
                  {tab.count ? (
                    <span
                      className={classNames(
                        current ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-900",
                        "hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
