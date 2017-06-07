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
   * ~~Any instances in an "error" state~~
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
 * handle error from token expiring

## Discuss W/ Mike
  * cluster logs not accessible through API - read straight from file on machine?
  * ask about special things to know about project creation (like there was with security groups)
  * what to show for "resource usage"
  * where to find hypervisor state





https://github.com/datamachines/intern-2017-project-ideas/blob/master/projects/cloudman.md
