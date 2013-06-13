/**
 * This file contains the learning view and appropo subviews and must be loaded
 * after the models and collections
 */


(function(AGFK, Backbone, _, $){

    /**
     * Display the model as an item in the node list
     * NOTE: the model is assumed to be a simple javascript object NOT a backbone model
     */
    AGFK.NodeListItemView = (function(){
        // define private variables and methods
        var pvt = {};

        pvt.viewConsts = {
            templateId: "node-title-view-template", // name of view template (warning: hardcoded in html)
            viewClass: "learn-title-display",
            viewIdPrefix: "node-title-view-div-"
        };

        // return public object
        return Backbone.View.extend({
            template: _.template(document.getElementById( pvt.viewConsts.templateId).innerHTML),
            id: function(){ return pvt.viewConsts.viewIdPrefix +  this.model.id;},
            className: pvt.viewConsts.viewClass,
            
            /**
             * Render the learning view given the supplied model
             */
            render: function(){
                var thisView = this;
                thisView.$el.html(thisView.template(thisView.model));
                return thisView;
            }

        });
    })();


    /**
     * View to display detailed resource information
     */
    AGFK.ResourceView = (function(){
        // define private variables and methods
        var pvt = {};

        pvt.viewConsts = {
            templateId: "resource-view-template",
            viewClass: "resource-view",
            viewIdPrefix: "resource-details-",
            extraResourceInfoClass: "extra-resource-details"
        };

        // return public object
        return Backbone.View.extend({
            template: _.template(document.getElementById( pvt.viewConsts.templateId).innerHTML),
            id: function(){ return pvt.viewConsts.viewIdPrefix +  this.model.cid;},
            className: pvt.viewConsts.viewClass,

            events: {
                'click .more-resource-info': 'toggleAdditionalInfo'
            },
            
            /**
             * Render the learning view given the supplied model
             */
            render: function(){
                var thisView = this;
                thisView.$el.html(thisView.template(thisView.model.toJSON()));
                return thisView;
            },

            toggleAdditionalInfo: function(evt){
                this.$el.find("." + pvt.viewConsts.extraResourceInfoClass).toggle();
            }

        });
    })();


    /**
     * Wrapper view to display all dependencies
     */
    AGFK.ResourcesSectionView = (function(){
        // define private variables and methods
        var pvt = {};

        pvt.viewConsts = {
            viewClass: "resources-wrapper",
            viewIdPrefix: "resources-wrapper-"
        };

        // return public object
        return Backbone.View.extend({
            id: function(){ return pvt.viewConsts.viewIdPrefix +  this.model.cid;},
            className: pvt.viewConsts.viewClass,
            
            /**
             * Render the learning view given the supplied model
             */
            render: function(){
                var thisView = this;
                thisView.$el.html("");
                thisView.model.each(function(itm){
                    thisView.$el.append(new AGFK.ResourceView({model: itm}).render().el);
                });
                thisView.delegateEvents();
                return thisView;
            }

        });
    })();

    /**
     * View to display details of all provided resources (wrapper view)
     */
    AGFK.DependencyView = (function(){
        // define private variables and methods
        var pvt = {};

        pvt.viewConsts = {
            templateId: "dependency-view-template",
            viewClass: "dependency-view",
            viewIdPrefix: "dependency-details-"
        };

        // return public object
        return Backbone.View.extend({
            template: _.template(document.getElementById( pvt.viewConsts.templateId).innerHTML),
            id: function(){ return pvt.viewConsts.viewIdPrefix +  this.model.cid;},
            className: pvt.viewConsts.viewClass,
            
            /**
             * Render the learning view given the supplied model
             */
            render: function(){
                var thisView = this;
                thisView.$el.html(thisView.template(thisView.model.toJSON()));
                return thisView;
            }

        });
   })();
    
    /**
     * Wrapper view to display all dependencies
     */
    AGFK.DependencySectionView = (function(){
        // define private variables and methods
        var pvt = {};

        pvt.viewConsts = {
            viewClass: "dependencies-wrapper",
            viewIdPrefix: "dependencies-wrapper-"
        };

        // return public object
        return Backbone.View.extend({
            id: function(){ return pvt.viewConsts.viewIdPrefix +  this.model.cid;},
            className: pvt.viewConsts.viewClass,
            
            /**
             * Render the learning view given the supplied model
             */
            render: function(){
                var thisView = this;
                thisView.$el.html("");
                thisView.model.each(function(itm){
                    thisView.$el.append(new AGFK.DependencyView({model: itm}).render().el);
                });
                thisView.delegateEvents();
                return thisView;
            }

        });
    })();


    /**
     * View to display additional notes/pointers
     * NOTE: expects a javascript model as input (for now) with one field: text
     */
    AGFK.PointersView = (function(){
        // define private variables and methods
        var pvt = {};

        pvt.viewConsts = {
            templateId: "pointers-view-template",
            viewClass: "pointers-view",
            viewIdPrefix: "pointers-view-"
        };

        // return public object
        return Backbone.View.extend({
            template: _.template(document.getElementById( pvt.viewConsts.templateId).innerHTML),
            id: function(){ return pvt.viewConsts.viewIdPrefix +  this.model.cid;},
            className: pvt.viewConsts.viewClass,
            
            /**
             * Render the learning view given the supplied model
             */
            render: function(){
                var thisView = this;
                thisView.$el.html(thisView.template(thisView.model));
                return thisView;
            }

        });
   })();
    

    /**
     * Displays detailed node information
     */
    AGFK.DetailedNodeView = (function(){
        // define private variables and methods
        var pvt = {};

        pvt.viewConsts = {
            templateId: "node-detail-view-template", // name of view template (warning: hardcoded in html)
            viewTag: "section",
            viewIdPrefix: "node-detail-view-",
            viewClass: "node-detail-view",
            freeResourcesLocClass: 'free-resources-wrap',
            paidResourcesLocClass: 'paid-resources-wrap',
            depLocClass: 'dep-wrap',
            ptrLocClass: 'pointers-wrap'
        };

        // return public object
        return Backbone.View.extend({
            template: _.template(document.getElementById( pvt.viewConsts.templateId).innerHTML),
            id: function(){ return pvt.viewConsts.viewIdPrefix + this.model.get("id");},
            tagName: pvt.viewConsts.viewTag,
            className: pvt.viewConsts.viewClass,
            
            /**
             * Render the learning view given the supplied model TODO consider using setElement instead of html
             * TODO try to reduce the boiler-plate repetition in rendering this view
             */
            render: function(){
                var thisView = this,
                    viewConsts = pvt.viewConsts,
                    assignObj = {},
                    freeResourcesLocClass = "." + viewConsts.freeResourcesLocClass,
                    paidResourcesLocClass = "." + viewConsts.paidResourcesLocClass,
                    depLocClass = "." + viewConsts.depLocClass,
                    ptrLocClass = "." + viewConsts.ptrLocClass;
                
                thisView.$el.html(thisView.template(thisView.model.toJSON()));
                thisView.fresources =
                    thisView.fresource || new AGFK.ResourcesSectionView({model: thisView.model.get("resources").getFreeResources()});
                thisView.presources = thisView.presources || new AGFK.ResourcesSectionView({model: thisView.model.get("resources").getPaidResources()});
                thisView.dependencies = thisView.dependencies || new AGFK.DependencySectionView({model: thisView.model.get("dependencies")});
                thisView.pointers = thisView.pointers || new AGFK.PointersView({model: {text: thisView.model.get("pointers")}});
                
                assignObj[freeResourcesLocClass] = thisView.fresources;
                assignObj[paidResourcesLocClass] = thisView.presources;
                assignObj[depLocClass] = thisView.dependencies;
                assignObj[ptrLocClass] = thisView.pointers;
                
                thisView.assign(assignObj);
                thisView.delegateEvents();
                return thisView;
            },

            /**
             * Assign subviews: method groked from http://ianstormtaylor.com/assigning-backbone-subviews-made-even-cleaner/
             */
            assign : function (selector, view) {
                var selectors;
                if (_.isObject(selector)) {
                    selectors = selector;
                }
                else {
                    selectors = {};
                    selectors[selector] = view;
                }
                if (!selectors) return;
                _.each(selectors, function (view, selector) {
                    view.setElement(this.$(selector)).render();
                }, this);
            },

            /**
             * Clean up the view properly
             */
            close: function(){
                this.unbind();
                this.remove();
            }

        });
    })();

    /**
     * Main learning view
     */
    AGFK.LearnView = (function(){
        // define private variables and methods
        var pvt = {};

        // keep track of expanded nodes: key: title node id, value: expanded view object
        pvt.expandedNodes = {};

        pvt.viewConsts = {
            viewId: "learn-view",
            clickedItmClass: "clicked-title"
        };

        pvt.insertSubViewAfter = function(subview, domNode){
                domNode.parentNode.insertBefore(subview.render().el, domNode.nextSibling);
        };

        // return public object
        return Backbone.View.extend({
            id: pvt.viewConsts.viewId,

            events: {
                "click .learn-title-display": "showNodeDetailsFromEvt"
            },

            /**
             * Display the given nodes details from the given event
             * and store the currentTarget.id:subview in pvt.expandedNodes
             */
            showNodeDetailsFromEvt: function(evt){
                var thisView = this,
                clkEl = evt.currentTarget,
                clkElClassList = clkEl.classList,
                nid,
                clickedItmClass = pvt.viewConsts.clickedItmClass;
                clkElClassList.toggle(clickedItmClass);
                if (clkElClassList.contains(clickedItmClass)){ 
                    nid = clkEl.id.split("-").pop();
                    var dnode = thisView.appendDetailedNodeAfter(thisView.model.get("nodes").get(nid), clkEl);
                    pvt.expandedNodes[clkEl.id] = dnode;
                }
                else{
                    if (pvt.expandedNodes.hasOwnProperty(clkEl.id)){
                        var expView = pvt.expandedNodes[clkEl.id];
                        expView.close();
                        delete pvt.expandedNodes[clkEl.id];
                    }
                }
            },

            /**
             * Append detailed node view to given element id that is a child of thisView
             * Returns the view object for the appended node
             */
            appendDetailedNodeAfter: function(nodeModel, domNode){
                var thisView = this,
                dNodeView = new AGFK.DetailedNodeView({model: nodeModel});
                pvt.insertSubViewAfter(dNodeView, domNode);
                return dNodeView;
            },
            
            /**
             * Render the learning view given the supplied collection TODO examine the rendering type and render appropriately
             */
            render: function(){
                var thisView = this,
                    nodes = thisView.model.get("nodes"),
                    nodeOrdering,
                    inum,
                    noLen,
                    simpleModel,
                    curNode,
                    $el = thisView.$el,
                    expandedNodes = pvt.expandedNodes,
                    expNode,
                    clkItmClass = pvt.viewConsts.clickedItmClass;

                $el.html(""); // TODO we shouldn't be doing this -- handle the subviews better
                // TODO cache node ordering
                nodeOrdering = thisView.getLVNodeOrdering();

                for (inum = 0, noLen = nodeOrdering.length; inum < noLen; inum++){
                    curNode = nodes.get(nodeOrdering[inum]);
                    simpleModel = {
                        title: curNode.get("title"),
                        id: curNode.get("id")
                    };
                    $el.append(new AGFK.NodeListItemView({model: simpleModel}).render().el); // not using entire backbone model to reduce JSON overhead
                }

                // recapture previous state TODO is this desirable behavior?
                for (var expN in expandedNodes){
                    if (expandedNodes.hasOwnProperty(expN)){
                        var domEl = document.getElementById(expN);
                        pvt.insertSubViewAfter(expandedNodes[expN], domEl);
                        domEl.classList.add(clkItmClass);
                        
                    }
                }
                thisView.delegateEvents();
                return thisView;
            },

            /**
             * Clean up the view
             */
            close: function(){
            var expN,
            expandedNodes = pvt.expandedNodes,
            domeEl;
                 for (expN in expandedNodes){
                    if (expandedNodes.hasOwnProperty(expN)){
                        domEl = document.getElementById(expN);
                        expandedNodes[expN].close();
                        delete expandedNodes[expN];
                    }
                }
                this.remove();
                this.unbind();
            },

            /**
             * Compute the learning view ordering
             * TODO this function may be migrated 
             * if the view ordering is user-dependent
             */
            getLVNodeOrdering: function(){
                var thisView = this,
                    curAddNodes = [], // current layer in the BFS
                    nextAddNodes = [], // next layel in the BFS
                    nodeOrdering = [], // returned node ordering
                    traversedNodes = {}, // nodes already added to list
                    curTag,  // current node being added to list
                    nodes = thisView.model.get("nodes"),
                    keyTag = thisView.model.get("keyNode");

                if (keyTag === ""){
                    // init: obtain node tags with 0 dependencies
                    curAddNodes = _.map(nodes.filter(function(mdl){
                        return mdl.get("outlinks").length == 0;
                    }), function(itm){
                        return itm.get("id");
                    });
                }
                else{
                    curAddNodes.push(keyTag);
                }
                
                // perform a level-based breadth first search 
                while(curAddNodes.length > 0){
                    curTag = curAddNodes.shift();
                    nodeOrdering.push(curTag);
                    
                    _.each(nodes.get(curTag).getUniqueDependencies(),
                    function(toAddNode){
                        // make sure we're adding a valid node'
                        if (!traversedNodes.hasOwnProperty(toAddNode) ){
                            nextAddNodes.push(toAddNode);
                        }
                        traversedNodes[toAddNode] = 1;
                    });
                    if (curAddNodes.length === 0){
                        // TODO disambiguate nodes at the same level here
                        curAddNodes = nextAddNodes;
                        nextAddNodes = [];
                    }
                }
                
                return nodeOrdering;   
            }
        });
    })();



})(window.AGFK = typeof window.AGFK == "object"? window.AGFK : {}, window.Backbone, window._, window.jQuery);