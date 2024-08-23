$(function() {
    // Model
    var Contact = Backbone.Model.extend({
        defaults: {
            name: '',
            phone: ''
        }
    });

    // Collection
    var ContactList = Backbone.Collection.extend({
        model: Contact
    });

    var Contacts = new ContactList();

    // View for a single contact
    var ContactView = Backbone.View.extend({
        tagName: 'li',
        template: _.template('<%- name %> - <%- phone %> <button class="delete">Delete</button>'),
        events: {
            'click .delete': 'deleteContact'
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        deleteContact: function() {
            this.model.destroy();
        }
    });

    // View for the list of contacts
    var AppView = Backbone.View.extend({
        el: '#contact-app',
        events: {
            'click #add-contact': 'addContact'
        },
        initialize: function() {
            this.nameInput = this.$('#name');
            this.phoneInput = this.$('#phone');
            this.listenTo(Contacts, 'add', this.addOne);
            this.listenTo(Contacts, 'reset', this.addAll);
        },
        addContact: function() {
            var name = this.nameInput.val().trim();
            var phone = this.phoneInput.val().trim();
            if (name && phone) {
                Contacts.add(new Contact({
                    name: name,
                    phone: phone
                }));
                this.nameInput.val('');
                this.phoneInput.val('');
            }
        },
        addOne: function(contact) {
            var view = new ContactView({ model: contact });
            this.$('#contact-list').append(view.render().el);
        },
        addAll: function() {
            this.$('#contact-list').empty();
            Contacts.each(this.addOne, this);
        }
    });

    var App = new AppView();
});
