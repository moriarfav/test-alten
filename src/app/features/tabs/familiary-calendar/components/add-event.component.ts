import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonList,
  IonCheckbox,
} from '@ionic/angular/standalone';

import { Logger } from '../../../../shared/utils/logger';
import { CalendarService } from 'src/app/services/familiary-calendar/calendar-service';
import { ModalController } from '@ionic/angular';
import {
  Event,
  FamilyEvent,
  FamilyMember,
} from 'src/app/models/family-events.model';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  standalone: true,
  providers: [ModalController, CalendarService],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonList,
    IonCheckbox,
  ],
})
export class AddEventComponent {
  constructor(
    private modalController: ModalController,
    private calendarService: CalendarService
  ) {}

  event: Event = {
    title: '',
    description: '',
    start_date: new Date().toISOString(),
    end_date: '',
    priority: 'medium',
    is_holiday: false,
    assigned_to: [],
  };

  familyMembers: FamilyMember[] = [];

  isMemberSelected(memberId: string | undefined): boolean {
    if (!memberId) {
      return false;
    }
    return this.event.assigned_to?.includes(memberId) ?? false;
  }

  toggleMemberSelection(memberId: string | undefined): void {
    if (!memberId) {
      return;
    }

    if (this.isMemberSelected(memberId)) {
      this.event.assigned_to = (this.event.assigned_to || []).filter(
        (id) => id !== memberId
      );
    } else {
      this.event.assigned_to = this.event.assigned_to || [];
      this.event.assigned_to.push(memberId);
    }
  }

  loadFamilyMembers() {
    this.calendarService
      .getMockFamilyMembers()
      .then((members) => {
        this.familyMembers = members;
        Logger.info(`Loaded ${members.length} family members`);
      })
      .catch((error) => {
        Logger.error('Failed to load family members', error);
        alert('Could not load family members');
      });
  }

  saveEvent() {
    if (!this.event.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    if (
      this.event.end_date &&
      new Date(this.event.end_date) < new Date(this.event.start_date)
    ) {
      alert('End date cannot be before start date');
      return;
    }

    Logger.debug('Saving event', this.event);

    this.calendarService
      .createEvent(this.event)
      .then((createdEvent) => {
        Logger.info('Event created successfully', { id: createdEvent.id });

        alert('Event created successfully!');

        this.event = {
          title: '',
          description: '',
          start_date: new Date().toISOString(),
          end_date: '',
          priority: 'medium',
        };

        this.calendarService.notifyEventCreated(createdEvent);
        const modal = document.querySelector('ion-modal');
        if (modal) {
          this.dismissModal(createdEvent);
        }
      })
      .catch((error) => {
        Logger.error('Failed to create event', error);
        alert('Failed to create event: ' + error.message);
      });
  }
  dismissModal(event?: FamilyEvent): void {
    this.modalController.dismiss(event, event ? 'created' : 'cancelled');
  }
}
