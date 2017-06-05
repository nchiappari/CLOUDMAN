 # Cloudman: Cloud manager

 ## Running
 Before running, update `var PASSWORD = ""` in html/index.html

 Dependencies:
  * node.js
  * electron (`npm install electron`)

  Start CloudMan:  
  `npm start`

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

https://github.com/datamachines/intern-2017-project-ideas/blob/master/projects/cloudman.md
