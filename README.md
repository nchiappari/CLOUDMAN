 # Cloudman: Cloud manager

 ## Running
 Before running, update `var PASSWORD = ""` in html/index.html

 Dependencies:
  * node.js
  * npm
  * electron (`npm install electron`)

  Start CloudMan:  
  `npm start`

 ## Goals
 Data Machines is currently in charge of quite a few OpenStack clouds. These
 deployments are all different sizes, versions, hardware compositions, etc. What
 they do share is the fact that OpenStack has had a fairly stable API and it is
 well versioned. We should be able to bubble up all of the statistics and
 information we care about into a single desktop application we can install
 on our machines.

 ## Initial Dependencies
 * electron
 * nodejs
 * python-openstackclient

 ## Priorities
 * Read only information about each cloud
   * Resource usage
   * Any instances in an "error" state
   * Any hypervisor in a "down" state
 * Alerts
 * Common tasks
   * ~~Security group creation~~
     * ~~Common groups~~
       * ~~e.g. SSH, HTTP, Ceph, etc~~
   * New project creation
     * Network
     * Routers
     * Gateway config
     * Security groups defaults
 * VM interaction
   * ~~Start/Stop/Restart~~
   * Boot logs
 * Cluster logs
   * Nova, neutron, cinder, glance, keystone
   * Apache error


## TODO
 * make alert overlay not just be placed at top
 * check set_loader being called correct number of times





 .
