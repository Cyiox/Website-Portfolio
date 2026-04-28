import React, { useEffect } from 'react';
import InteractiveCarousel from '../components/InteractiveCarousel';
import Engr32Quiz from '../components/Engr32Quiz';
import './Engr32.css';

function Engr32() {
    useEffect(() => {
        // Create the script element
        const script = document.createElement('script');
        script.src = 'https://embed.tradingeconomics.com/widget.js';
        script.async = true;

        // Append it to the body to trigger the widget search
        document.body.appendChild(script);

        // Optional: Cleanup script on unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const mediaItems = [
        { src: '/assets/Engr32Assets/IMG_6681.jpg', type: 'image', caption: 'Windmill in Naguabo' },
        { src: '/assets/Engr32Assets/IMG_6682.jpg', type: 'image', caption: 'Terrain around Naguabo windmill' },
        { src: '/assets/Engr32Assets/IMG_6476.MOV', type: 'video', caption: 'Hydroelectric Plant' },
        { src: '/assets/Engr32Assets/IMG_6558.jpg', type: 'image', caption: 'A stray windmill' },
        { src: '/assets/Engr32Assets/IMG_6409.jpg', type: 'image', caption: 'I wonder what type of emissions this monster puts out' }
    ];

    return (
        <div className="engr32-container">
            <h1>Energy In Puerto Rico</h1>
            <p>So far in class, we have talked about how the world has gotten a lot greener than it was 30 years ago, increasing investment in renewable energy, major efficiency gains from evolving technology, etc.  However, what if I told you that there is a place that still gets 93% of its electricity from burning fossil fuels to serve its population of 3.2 million people? Welcome to my home, Puerto Rico.</p>
            <img src="/assets/Engr32Assets/PuertoRicoSat.jpg" alt="Puerto Rico Satellite Image" />
            <p>
                The goal of this project is to analyze the systems that Puerto Rico relies on for energy, specifically tackling the challenge of how to reliably generate and transmit electricity to the people of P.R. while not breaking the bank. Major challenges include not having access to local fossil fuels and being a place that is prone to natural disasters. In order to draft solutions, we need to understand the current system, so let's take a look.
            </p>
            <h2>Present Day</h2>
            <figure>
                <img src="/assets/Engr32Assets/SankeyWithReal.svg" alt="Puerto Rico Grid" />
                <figcaption>Numbers are in billions of kWh</figcaption>
            </figure>
            <p>
                As of today, P.R. gets over 90% of its electricity from imported fossil fuels—petroleum, natural gas, and coal. Because the island has no significant fossil fuel reserves of its own, these fuels must be shipped in, leading to electricity rates that are significantly higher than the U.S. national average. Furthermore, the centralized nature of its aging power plants and long transmission lines makes the grid incredibly vulnerable. When hurricanes like Maria (2017) and Fiona (2022) struck, they decimated the transmission infrastructure, leaving residents without power for months.
            </p>

            <h2>The Problem</h2>
            <ul>
                <li><strong>Astronomical Costs:</strong> PR's reliance on imported fossil fuels, particularly oil, keeps energy prices incredibly high and unpredictable. There is not a sense of stability in energy infrastructure.</li>
                <div className="te-embed" data-height='400' data-width='600' data-url='/puerto-rico/gasoline-prices'></div>
                <h3>The Price of Dependency</h3>
                <p>
                    To put the "Astronomical Costs" of relying on imported fossil fuels into perspective, consider the price gap between Puerto Rico and the U.S. mainland as of January 2026:
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Sector</th>
                            <th>Puerto Rico (¢/kWh)</th>
                            <th>U.S. Average (¢/kWh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Residential</td>
                            <td>23.74</td>
                            <td>17.45</td>
                        </tr>
                        <tr>
                            <td>Commercial</td>
                            <td>26.75</td>
                            <td>13.64</td>
                        </tr>
                        <tr>
                            <td>Industrial</td>
                            <td>25.46</td>
                            <td>9.29</td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    <em>Source: EIA, January 2026 Data</em></p>
                <li><strong>Grid Fragility:</strong> A single, centralized grid with hundreds of miles of exposed transmission lines stretching across complex, mountainous terrain is easily severed by hurricane-force winds.</li>
                <img src='/assets/Engr32Assets/TransmissionLinesMoutain.webp' alt="Transmission Lines over Mountains" />
                <li><strong>Ecological Strain:</strong> Burning heavy fuel oil and coal contributes to regional air pollution and goes against global pushes toward sustainability, especially because PR is legally mandated to achieve carbon neutrality by the Puerto Rico Energy Public Policy Act (Act 17-2019) by 2050. This act also requires PR to have 40% of energy generation from renewable sources by 2025 (This date has since been extended), 60% by 2040, and to phase out all coal-fired generation by 2028. Puerto Rico emitted 19 million metric tons of CO2 in 2023, 12 million of that being directly from petroleum. (EIA data)</li>
            </ul>

            <h2>The Solution</h2>
            <p>
                The best solution to this reliable energy problem is to take advantage of one the island's most abundant resources: The Sun. A lot of residents are tired of the instability of the grid and are taking matters into their own hands. A lot of people from my family have installed rooftop solar panels attached to local battery storage (for example, the Tesla Powerwall) and have been able to stay powered during outages. On average, 3,850 rooftop solar arrays have been installed per month in PR in 2025, with 191,929 systems in place by the end of 2025. The total capacity of PR's battery storage by the end of 2025 was 2,864 MWh.
                <img src='/assets/Engr32Assets/main.svg' alt="Battery Storage Graph" />
            </p>

            <h3>Why a Solar Shift Makes Sense</h3>
            <ul>
                <li><strong>Resiliency:</strong> Rooftop solar arrays paired with local battery storage ensure that even if the central grid goes offline, individual homes, hospitals, and communities remain powered. Microgrids prevent a single failure point from dragging down the entire island.</li>
                <li><strong>Cutting Out the Middleman:</strong> While the initial infrastructure investment is high, the "fuel" (sunlight) is permanently free. This effectively buffers everyday consumers from unpredictable fossil fuel spikes.</li>
                <li><strong>Energy Independence:</strong> Localizing generation cuts off the dependency on massive fossil fuel imports, allowing money that normally goes overseas to remain within the local economy. In fact, since so many people are selling their energy back to the system, the panels have a low energy payback time and low LCOE, bringing money into the pockets of residents.</li>
                <li><strong>Transmission Benefits:</strong> Since energy generation and storage is on a local level, long, unstable transmission lines over mountains are not as necessary, as transmission can be maintained at a local level.</li>
            </ul>
            <h3>What about other Renewable Sources?</h3>
            <p>Puerto Rico is no stranger to other renewable energy sources, and also makes use out of wind and hydroelectric power.</p>
            <h4>Hydroelectric</h4>
            <p>While there is a huge possibility to extract hydro power, little of its potential has been realized. There are 21 reservoirs (dams) capable of producing electricity, but only 10 of them are operational as of today. After hurricane Maria, most of the dams were severely damaged to the point of not being operational. Hydro power only has a capacity of 92 MW in PR, less than 1% of total generation.</p>
            <h4>Wind</h4>
            <p>There are two primary wind farms in PR, both of which are located near the shoreline where the land is flat, along with several smaller installations. They account for 123 MW of PR's generation capacity, which is 1.68% of total generation. While wind is a viable option, its potential is limited as they are highly susceptible to damage by hurricane-force winds. Punta Lima, a wind farm which was installed in 2012, was closed down during hurricane Maria in 2017. Punta Lima did not open again until 2025.</p>

            <h2>Renewable Gallery</h2>
            <InteractiveCarousel mediaItems={mediaItems} />
            <h3>Bonus Quiz</h3>
            <Engr32Quiz />

        </div>
    )
}
export default Engr32   