const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    userId: {
        type: String
    },
    welcomeScreen: {
        visitorIn: {
            type: String
        },
        visitorInTextColor: {
            type: String
        },
        visitorInBackgroundColor: {
            type: String
        },
        visitorInBorder: {
            type: String
        },
    },
    branding: {

        brandColor: {
            type: String,
            default: "#32BDFF"
        }
    },
    visitorSetting: {
        rememberVisitor: {
            type: Boolean,
            default: false
        },
        visitorNameMatch: {
            type: Boolean,
            default: true
        },
        selectHost: {
            type: Boolean,
            default: true
        },
        displayEmployeeList: {
            type: Boolean,
            default: true
        },
        sendVisitorNotificationByEmail: {
            // isNotification: {
                type: Boolean,
                default: false
            // },
            // select: [],
        },
        takePhotoOfVisitor: {
            type: Boolean,
            default: true
        },
        automaticallySignOut: {
            isSignedOut: {
                type: Boolean,
                default: false
            },
            time: {
                type: String,
                default:"7:00pm"
            }
        },
        visitorCentralRecipients: {
            type: Boolean,
            default: false
        },
        approvalCentralRecipient: {
            isAprroved: {
                type: Boolean,
                default: false
            },
            notificationEmail: [],
        },
        mobilePhone: {
            type: Number,
        },
        visitorNotifications: {
            isNotification: {
                type: Boolean,
                default: false
            },
            approvalemail: []
        },
    },

    visitorFieldSetting: {
        category: {
            type: String
        },
        addCategory: [{
            categoryType: String,
            disableHost: Boolean,
            disableCatering: Boolean,
            hidden: Boolean
        }],
        agreement: {
            type: String
        },
        hideInactiveFields: {
            type: Boolean
        },
        addFields: []
    },
    idBadge: {
        scanBadgeToSignOut: {
            type: Boolean,
            default: true
        },
        badgeType: {
            type: String,
            default: "Photo"
        },
    },
    contactLess: {
        generateDynamicQR: {
            type: Boolean,
            default: false
        },
        employeeInOut: {
            type: Boolean,
            default: false
        },
        requiredLocation: {
            type: Boolean,
            default: false
        },
        rememberEmployee: {
            type: Boolean,
            default: false
        }
    },
    EmployeeSetting: {
        allowEmployee: {
            type: Boolean
        },
        showField: {
            type: Boolean
        },
        automaticallySignOut: {
            type: Boolean
        },
        selected: {
            type: String
        },
        requestSignout: {
            type: Boolean
        },
        //     signoutEmployeesTime: {
        //         type: String
        //     },
        //    lockEmployeesList: {
        //         type: Boolean
        //     },
        //     signOutMessagesRequire: {
        //         type: Boolean
        //     },
        employeeFields: [{
            label: String,
            fieldType: String
        }],

        employeeQuestionsText: [{
            label: String,
            fieldType: String,
            require: Boolean,
        }],
        employeeQuestionsRadio: [{
            label: String,
            fieldType: String,
            require: Boolean,
            requireApprovalIf: Boolean,
            YesNo: Boolean
        }],
        signOutMessages: [{
            label: String,
            fieldType: String
        }]
    },

    deliverySetup: {
        scanLabel: {
            type: Boolean
        },
        generalsDeliveries: {
            type: Boolean
        },
        deliveriesContacts: [],
    },

    deliveryInstructions: {
        Recipient: {
            type: String
        }
    },
    signOutMessages: [{
        message: String,
        hidden: Boolean
    }],
    created_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('setting', settingSchema)