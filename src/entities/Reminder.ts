import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from "typeorm"

import Webhook from "./Webhook"
import User from "./User"
import EveryType from "../utils/EveryType"
import IgnoreType from "../utils/IgnoreType"
import ActionType from "../utils/ActionType"

@Entity()
class Reminder {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    message: string

    @ManyToOne(type => Webhook, webhook => webhook.reminders, { onDelete:'CASCADE' })
    webhook: Webhook

    @Column()
    startDate: Date

    @Column()
    active: boolean

    @Column('varchar')
    repeat: EveryType

    @Column('varchar')
    ignore: IgnoreType

    @Column()
    endDate: Date

    @Column()
    nextExecution: Date

    @ManyToMany(type => User, user => user.subscribed, { onDelete:'CASCADE' })
    @JoinTable()
    access: User[]

    @Column('varchar')
    action: ActionType

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date
}

export default Reminder