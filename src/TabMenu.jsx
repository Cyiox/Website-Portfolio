import { useState } from "react"


function TabMenu () {
    const [activeTab, setActiveTab] = useState("tab1")

    const SwitchTabs = () => {
        switch (activeTab) {
            case "tab1":
                return <div>
                    <h2>Metadata Assistant @ Brandeis University</h2>
                    <h3>June 2024 - Present : Waltham, MA</h3>
                    <ul>
                        <li>
                            Manage metadata information of over 10,000 libray items.
                        </li>
                        <li>
                            Assisted in implementing a library search service using Python.
                        </li>
                        <li>
                            Used Python to make data entry 30% faster than manually entering information.
                        </li>
                    </ul>

                </div>
            case "tab2":
                return <div>
                    <h2>Moodle Liason @ Brandeis University</h2>
                    <h3>Januray 2024 - May 2024 : Waltham, MA</h3>
                    <ul>
                        <li>
                        Assisted in the campus-wide classroom management software migration from LATTE to Moodle.
                        </li>
                        <li>
                        Gave demonstrations of the new software to students and faculty.
                        </li>
                        <li>
                        Gathered student and staff feedback in order to make the change as smoothly as possible.
                        </li>
                    </ul>
                </div>
            case "tab3":
                return <div>
                    <h2>Research Assistant @ Masschusetts Institute of Technology</h2>
                    <h3>Januray 2022 - June 2022 : Cambridge, MA</h3>
                    <ul>
                        <li>
                        Worked in MIT's Picower Institute of Learning and Memory.
                        </li>
                        <li>
                        Studied which protiens controlled synpases in fruit flies.
                        </li>
                        <li>
                        Performed PCR tests on genetic material from fruit flies.
                        </li>
                        <li>
                        Created and managed a storage system of over 60 living fruit fly specimens.
                        </li>
                    </ul>
                </div>
            case "tab4":
                return <div>
                    <h2>Assistant Teacher @ Cambridge Public Shools</h2>
                    <h3>June 2022 - August 2022 : Cambridge, MA</h3>
                    <ul>
                        <li>
                            Faclitated daily activitys for 5th grade campers.
                        </li>
                        <li>
                            Ensured that camp policies were enforced, and campers were safe. 

                        </li>
                        <li>
                            Collaborated with fellow counselors to coordinate and schedule day trips and events.
                        </li>

                    </ul>
                </div>
            default:
                return <div>Default Content</div>
        }
    };

        
    
    return(
        <div className="tab-container">
            <div className="tab-navigation">
                <button className={activeTab === "tab1" ? "tab active" : "tab"} onClick={() => setActiveTab("tab1")}>Metadata Assistant @ Brandeis</button>
                <button className={activeTab === "tab2" ? "tab active" : "tab"} onClick={() => setActiveTab("tab2")}>Moodle Liason @ Brandeis</button>
                <button className={activeTab === "tab3" ? "tab active" : "tab"} onClick={() => setActiveTab("tab3")}>Research Assistant @ MIT</button>
                <button className={activeTab === "tab4" ? "tab active" : "tab"} onClick={() => setActiveTab("tab4")}>Assistant Teacher @ City of Cambridge</button>

            </div>
            <div className="tab-content">
                {SwitchTabs()}
            </div>
        </div>
    )
}
export default TabMenu